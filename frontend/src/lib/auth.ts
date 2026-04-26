import type { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

interface CustomUser extends User {
  role: string;
  permissions: string[];
}

export const authOptions: NextAuthOptions = {
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
          // Call the backend API for authentication
          const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            console.log('Backend authentication failed with status:', response.status);
            return null;
          }

          const userData = await response.json();
          
          console.log('Backend authentication successful:', userData);
          
          return {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            permissions: userData.permissions,
          } as CustomUser;
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
        // Initial login - set all user data from the authorize response
        token.role = (user as CustomUser).role;
        token.email = user.email;
        token.permissions = (user as CustomUser).permissions || [];
      } else if (token.email && !token.permissions) {
        // Session refresh - fetch permissions from backend API
        console.log('No permissions in token, fetching from backend...');
        try {
          const response = await fetch(
            `${BACKEND_URL}/api/auth/me?email=${encodeURIComponent(token.email as string)}`,
            { method: 'GET' }
          );

          if (response.ok) {
            const userData = await response.json();
            token.role = userData.role;
            token.permissions = userData.permissions;
            console.log('Fetched role and permissions from backend:', token.role, token.permissions);
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
