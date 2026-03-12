import type { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

interface CustomUser extends User {
  role: string;
  permissions: string[];
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('Authorize called with credentials:', credentials);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password');
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            },
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true
                    }
                  }
                }
              }
            }
          });

          console.log('User found:', user);

          if (!user || !user.password) {
            console.log('User not found or no password');
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          console.log('Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('Invalid password');
            return null;
          }

          const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role?.name || 'USER',
            permissions: user.role?.permissions.map(rp => rp.permission.name) || []
          };

          console.log('Authorization successful, returning:', userData);
          return userData;
        } catch (error) {
          console.error('Error in authorize function:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback called with:', { token, user });
      if (user) {
        // Initial login - set all user data
        token.role = user.role;
        token.email = user.email;
        token.permissions = (user as CustomUser).permissions || [];
      } else if (token) {
        // Session refresh - ensure permissions are preserved
        // If permissions don't exist in token, we need to fetch them
        if (!token.permissions || !token.role) {
          console.log('No permissions or role in token, fetching from database...');
          try {
            const userData = await prisma.user.findUnique({
              where: { email: token.email as string },
              include: {
                role: {
                  include: {
                    permissions: {
                      include: {
                        permission: true
                      }
                    }
                  }
                }
              }
            });
            
            if (userData && userData.role) {
              token.role = userData.role.name;
              token.permissions = userData.role.permissions.map(rp => rp.permission.name);
              console.log('Fetched role and permissions from DB:', token.role, token.permissions);
            } else {
              token.role = 'USER';
              token.permissions = [];
            }
          } catch (error) {
            console.error('Error fetching role and permissions:', error);
            token.role = 'USER';
            token.permissions = [];
          }
        }
      }
      console.log('JWT callback returning token:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback called with:', { session, token });
      if (session?.user) {
        session.user.role = token.role as string;
        session.user.id = token.sub;
        session.user.permissions = (token.permissions as string[]) || [];
      }
      console.log('Session callback returning session:', session);
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
};