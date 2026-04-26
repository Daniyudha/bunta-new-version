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
# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Generate Prisma Client
```bash
cd backend && npx prisma generate && cd ..
```

### 3. Run Database Migrations
```bash
cd backend && npx prisma migrate deploy && cd ..
```

### 4. Fix Upload Directories
```bash
node backend/scripts/fix-upload-directories.js
```

This creates the following upload directories:
- `backend/public/uploads/sliders/` – Slider images
- `backend/public/uploads/irrigation/` – Irrigation profile images (building scheme, network scheme, RTTG, planting schedule)
- `backend/public/uploads/gallery/` – Gallery images
- `backend/public/uploads/news/` – News images
- `backend/public/uploads/employees/` – Employee profile photos

### 5. Seed the Database (All-in-One)
```bash
cd backend && npm run seed && cd ..
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
node backend/scripts/check-data.js
```

### 7. Build the Application
```bash
cd frontend && npm run build && cd ..
```

### 8. Restart the Application

Choose the appropriate method based on your deployment setup:

#### Using PM2 (recommended for production)
```bash
pm2 restart bunta-frontend bunta-backend
# Or use ecosystem config:
pm2 reload ecosystem.config.js --env production
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
# Backend
cd backend && node src/index.js &

# Frontend
cd frontend && npm start &
```

## Environment Configuration

Ensure your environment variables are properly set in the respective `.env` files:

### Backend (`backend/.env`)
```env
DATABASE_URL="mysql://user:password@host:3306/bunta_bella_production"
PORT=5001
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="https://irigasibunta.com"
NODE_ENV="production"
UPLOAD_DIR="/var/www/uploads"
MAX_FILE_SIZE=10485760
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_google_maps_api_key"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="https://irigasibunta.com"
NODE_ENV="production"
NEXT_PUBLIC_BACKEND_URL="https://be.irigasibunta.com"
```

## Production Considerations

### 1. Database Backups

Always backup your database before running migrations or making significant changes.

#### Option A: Using mysqldump (recommended)
```bash
# Backup MySQL database
mysqldump -h localhost -u username -p database_name > backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

#### Option B: Using Prisma backup script (portable, no MySQL client needed)
```bash
# Export all data as JSON
node backend/scripts/backup-database.js

# Output saved to: backups/backup_YYYY-MM-DD_HH-MM-SS.json
```

#### Option C: Using Prisma Studio (manual export)
```bash
cd backend && npx prisma studio
# Use the Studio UI to manually view and export data
```

### 2. Monitoring
Set up monitoring for your production environment:
- Use PM2 monitoring: `pm2 monit`
- Enable logging: Check PM2 logs with `pm2 logs`
- Monitor API health: `curl https://be.irigasibunta.com/api/health`

### 3. SSL Certificate
For production, ensure you have SSL certificates configured:
```bash
sudo certbot --nginx -d irigasibunta.com -d www.irigasibunta.com
sudo certbot --nginx -d be.irigasibunta.com
```

### 4. Environment Variables in Production
For production, set environment variables in your deployment platform:
- For PM2: Use `ecosystem.config.js`
- For Docker: Use `docker-compose.yml` environment section
- For systemd: Use Environment directives in service file

## Upload Directory Permissions

Ensure the upload directories exist and are writable:

```bash
sudo mkdir -p /var/www/bunta-bella-irrigation/backend/public/uploads
sudo mkdir -p /var/www/bunta-bella-irrigation/backend/public/uploads/sliders
sudo mkdir -p /var/www/bunta-bella-irrigation/backend/public/uploads/irrigation
sudo mkdir -p /var/www/bunta-bella-irrigation/backend/public/uploads/gallery
sudo mkdir -p /var/www/bunta-bella-irrigation/backend/public/uploads/news
sudo mkdir -p /var/www/bunta-bella-irrigation/backend/public/uploads/employees
sudo chown -R www-data:www-data /var/www/bunta-bella-irrigation/backend/public/uploads
sudo chmod -R 755 /var/www/bunta-bella-irrigation/backend/public/uploads
```

## Features & Recent Changes

### Slider Management
- Admin: Create, read, update, delete sliders at `/admin/content/sliders`
- Toggle active/inactive status with eye button on management page
- Image upload with preview (recommended size: 1200x600px)
- Public display via `SliderCarousel` component

### Gallery Management
- Admin: Create, read, update, delete gallery items at `/admin/content/gallery`
- Supports both image upload and YouTube video embeds
- Public display with lightbox viewer at `/gallery`
- Category filtering for gallery items

### Irrigation Profile Management
- Admin: Manage irrigation profiles at `/admin/irrigation-profiles`
- Each profile supports 4 image uploads:
  - **Building Scheme** (buildingScheme)
  - **Network Scheme** (networkScheme)
  - **RTTG Document** (rttg)
  - **Planting Schedule** (plantingSchedule)
- Create form at `/admin/irrigation-profiles/create`
- Edit form at `/admin/irrigation-profiles/edit/[id]`
- Public view with accordion and image lightbox at `/irrigation`
- Image field name for upload: `'file'` (must match backend `upload.single('file')`)

### Data Management
- Water level, rainfall, crop, and farmer data management at `/admin/data`
- CSV import/export functionality
- Location-based data filtering

### News & Categories
- News articles with CKEditor rich text editor
- Category management for news articles
- Public news listing with detail pages

### Employee Management
- CRUD operations for employees at `/admin/employees`
- Employee profile photo upload
- Public employee listing at `/kepegawaian`

## Troubleshooting

### Common Issues

1. **Permission denied when running deploy.sh**
   ```bash
   chmod +x deploy.sh
   ```

2. **Database connection errors**
   - Verify `DATABASE_URL` in `backend/.env`
   - Check database server is running
   - Ensure user has proper permissions

3. **Build failures**
   - Check Node.js version (requires Node.js 18+)
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

4. **Migration conflicts**
   - Check existing migrations: `npx prisma migrate status`
   - Reset and reapply: `npx prisma migrate reset` (⚠️ deletes data)

5. **File upload fails with "Unexpected field"**
   - The backend uses `upload.single('file')` for all upload endpoints
   - Frontend FormData must use `'file'` as the field name, NOT `'image'`
   - Check that `backend/public/uploads/` subdirectories exist and are writable

6. **Image not displaying after upload**
   - Verify the uploaded file exists in the correct upload subdirectory
   - Check Nginx is configured to serve static files from `backend/public/uploads/`
   - Restart Nginx after adding new upload directories: `sudo systemctl restart nginx`

### Logs and Debugging

- Application logs: `pm2 logs bunta-frontend` / `pm2 logs bunta-backend`
- Build logs: Check npm build output
- Database logs: Check your database server logs
- API health check: `curl https://be.irigasibunta.com/api/health`

## Nginx Static File Serving for Uploads

Ensure your Nginx configuration includes a location block to serve uploaded files:

```nginx
# In /etc/nginx/sites-available/bunta-bella-irrigation
location /uploads/ {
    alias /var/www/bunta-bella-irrigation/backend/public/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

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
      run: |
        cd backend && npm install
        cd ../frontend && npm install
      
    - name: Generate Prisma client
      run: cd backend && npx prisma generate
      
    - name: Run migrations
      run: cd backend && npx prisma migrate deploy
      env:
        DATABASE_URL: ${{ secrets.DATABASE_URL }}
        
    - name: Build application
      run: cd frontend && npm run build
      
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /var/www/bunta-bella-irrigation
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
   - Change `NEXTAUTH_SECRET` periodically
   - Rotate database passwords
   - Update Google Maps API key if exposed

3. **File permissions**
   - Ensure uploads directory has proper permissions (755 for dirs, 644 for files)
   - Restrict access to `.env` and `.env.local` configuration files
   - Never commit `.env` files with real credentials

## Performance Optimization

1. **Nginx caching for uploads**
   ```nginx
   location /uploads/ {
       alias /var/www/bunta-bella-irrigation/backend/public/uploads/;
       expires 30d;
       add_header Cache-Control "public, immutable";
   }
   ```

2. **CDN for static assets**
   - Configure CDN for images and static files
   - Use Next.js Image optimization (already configured)

3. **Database indexing**
   - Regularly analyze and optimize database indexes
   - Use Prisma's built-in performance tools

## Support

If you encounter issues during deployment:
1. Check this documentation
2. Review error messages in logs: `pm2 logs`
3. Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
4. Contact development team if needed

---
*Last updated: April 2026*