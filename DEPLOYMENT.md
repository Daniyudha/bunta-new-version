# Deployment Guide for Bunta-Bella Irrigation System

This guide covers the deployment process after pulling updates from GitHub.

## Quick Deployment

After pulling the latest changes from GitHub, run the deployment script:

```bash
./deploy.sh
```

## Manual Deployment Steps

If you prefer to run the steps manually, here's what the deployment script does:

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Run Database Migrations
```bash
npx prisma migrate deploy
```

### 4. Fix Upload Directories
```bash
node scripts/fix-upload-directories.js
```

### 5. Seed the Database (All-in-One)
```bash
npm run seed
```

This single command now seeds:
- All system permissions
- SUPER_ADMIN and ADMIN roles with full permissions
- Super Admin user (su.admin@irigasibunta.com / Buntamengalir25!)
- Admin user (admin@buntabella.go.id / admin123)
- Default categories

### 6. Optional: Verify Data (if needed)
```bash
# Check data consistency
node scripts/check-data.js
```

### 6. Build the Application
```bash
npm run build
```

### 7. Restart the Application

Choose the appropriate method based on your deployment setup:

#### Using PM2 (recommended for production)
```bash
pm2 restart bunta-bella-irrigation
```

#### Using systemd
```bash
sudo systemctl restart bunta-bella-irrigation
```

#### Using Docker
```bash
docker-compose up -d --build
```

#### Using direct Node.js
```bash
npm start
```

## Environment Configuration

Ensure your environment variables are properly set in `.env.local`:

```env
# Database
DATABASE_URL="your_database_connection_string"

# NextAuth.js
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# Google Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
```

## Production Considerations

### 1. Database Backups
Always backup your database before running migrations:
```bash
# Example for MySQL
mysqldump -u username -p database_name > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 2. Monitoring
Set up monitoring for your production environment:
- Use PM2 monitoring: `pm2 monit`
- Enable logging: Check PM2 logs with `pm2 logs`

### 3. SSL Certificate
For production, ensure you have SSL certificates configured. You can use Let's Encrypt:
```bash
sudo certbot --nginx -d yourdomain.com
```

### 4. Environment Variables in Production
For production, set environment variables in your deployment platform:
- For PM2: Use ecosystem.config.js
- For Docker: Use docker-compose.yml environment section
- For systemd: Use Environment directives in service file

## Troubleshooting

### Common Issues

1. **Permission denied when running deploy.sh**
   ```bash
   chmod +x deploy.sh
   ```

2. **Database connection errors**
   - Verify DATABASE_URL in .env.local
   - Check database server is running
   - Ensure user has proper permissions

3. **Build failures**
   - Check Node.js version (requires Node.js 18+)
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`

4. **Migration conflicts**
   - Check existing migrations: `npx prisma migrate status`
   - Resolve conflicts manually if needed

### Logs and Debugging

- Application logs: `pm2 logs bunta-bella-irrigation`
- Build logs: Check npm build output
- Database logs: Check your database server logs

## Automated Deployment with GitHub Actions

For continuous deployment, you can set up GitHub Actions. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm install
      
    - name: Generate Prisma client
      run: npx prisma generate
      
    - name: Run migrations
      run: npx prisma migrate deploy
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
        
    - name: Build application
      run: npm run build
      
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /path/to/bunta-bella-irrigation
          git pull
          ./deploy.sh
```

## Security Considerations

1. **Keep dependencies updated**
   ```bash
   npm audit
   npm update
   ```

2. **Regularly rotate secrets**
   - Change NEXTAUTH_SECRET periodically
   - Rotate database passwords

3. **File permissions**
   - Ensure uploads directory has proper permissions
   - Restrict access to configuration files

## Performance Optimization

1. **Enable compression**
   ```bash
   # In next.config.js
   compress: true
   ```

2. **CDN for static assets**
   - Configure CDN for images and static files
   - Use Next.js Image optimization

3. **Database indexing**
   - Regularly analyze and optimize database indexes
   - Use Prisma's built-in performance tools

## Support

If you encounter issues during deployment:
1. Check this documentation
2. Review error messages in logs
3. Check GitHub Issues for similar problems
4. Contact development team if needed

---
*Last updated: $(date)*