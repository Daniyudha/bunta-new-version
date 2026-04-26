# Bunta Bella Irrigation System - Production Deployment Guide

This guide outlines the steps to deploy the Bunta Bella Irrigation system to a production server (Ubuntu 20.04/22.04 recommended).

## Prerequisites

- A server with **Ubuntu 20.04/22.04** LTS (or similar Linux distribution)
- **Node.js** 18.x or later
- **MySQL** 8.x
- **Nginx**
- **PM2** (process manager)
- **Git**
- A domain name pointed to your server's IP address

## 1. Server Setup

Update the system and install required packages:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y nodejs npm mysql-server nginx git
```

Install PM2 globally:

```bash
sudo npm install -g pm2
```

## 2. Database Setup

Create a MySQL database and user for the application:

```sql
CREATE DATABASE bunta_bella_production;
CREATE USER 'bunta_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON bunta_bella_production.* TO 'bunta_user'@'localhost';
FLUSH PRIVILEGES;
```

## 3. Application Deployment

Clone the repository (if not already present) and navigate into the project directory:

```bash
git clone <your-repo-url> /var/www/bunta-bella-irrigation
cd /var/www/bunta-bella-irrigation
```

### 3.1 Environment Configuration

Copy the production environment templates and fill in your actual values:

```bash
cp backend/.env.production backend/.env
cp frontend/.env.production frontend/.env.local
```

Edit both files with a text editor (nano/vim) and replace placeholders:

- `DATABASE_URL` – use your MySQL production connection string
- `NEXTAUTH_SECRET` – generate a strong secret (`openssl rand -base64 32`)
- `NEXTAUTH_URL` – your production domain (e.g., `https://irigasibunta.com`)
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` – a valid Google Maps API key

### 3.2 Install Dependencies and Build

Run the deployment script (which installs dependencies, generates Prisma client, runs migrations, and builds the app):

```bash
./deploy.sh
```

If you prefer to run steps manually, execute:

```bash
npm install
cd backend && npx prisma generate && npx prisma migrate deploy && cd ..
npm run build
```

## 4. Process Management with PM2

Start the frontend and backend as separate PM2 processes.

**Backend** (runs on port 5001):

```bash
cd /var/www/bunta-bella-irrigation/backend
pm2 start npm --name "bunta-backend" -- start
```

**Frontend** (runs on port 3000):

```bash
cd /var/www/bunta-bella-irrigation/frontend
pm2 start npm --name "bunta-frontend" -- start
```

Save the PM2 process list so it persists after reboot:

```bash
pm2 save
pm2 startup
```

## 5. Nginx Configuration

Copy the provided Nginx configuration to the appropriate site‑enabled directory:

```bash
sudo cp /var/www/bunta-bella-irrigation/nginx/bunta-bella-irrigation.conf /etc/nginx/sites-available/bunta-bella-irrigation
sudo ln -sf /etc/nginx/sites-available/bunta-bella-irrigation /etc/nginx/sites-enabled/
```

Edit the configuration file to match your domain and SSL certificate paths:

```bash
sudo nano /etc/nginx/sites-available/bunta-bella-irrigation
```

Replace:
- `your-domain.com` with your actual domain
- SSL certificate paths (if using Let’s Encrypt, see section 6)

Test the configuration and restart Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## 6. SSL Certificate (Let’s Encrypt)

Install Certbot and obtain a free SSL certificate:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the interactive prompts. Certbot will automatically update your Nginx configuration.

## 7. Upload Directory Permissions

Ensure the upload directories exist and are writable. Multiple subdirectories are needed for different feature areas:

```bash
# Create all upload subdirectories
sudo mkdir -p /var/www/bunta-bella-irrigation/backend/public/uploads
sudo mkdir -p /var/www/bunta-bella-irrigation/backend/public/uploads/sliders
sudo mkdir -p /var/www/bunta-bella-irrigation/backend/public/uploads/irrigation
sudo mkdir -p /var/www/bunta-bella-irrigation/backend/public/uploads/gallery
sudo mkdir -p /var/www/bunta-bella-irrigation/backend/public/uploads/news
sudo mkdir -p /var/www/bunta-bella-irrigation/backend/public/uploads/employees

# Set ownership and permissions
sudo chown -R www-data:www-data /var/www/bunta-bella-irrigation/backend/public/uploads
sudo chmod -R 755 /var/www/bunta-bella-irrigation/backend/public/uploads
```

### Upload Subdirectory Reference

| Directory | Purpose | Used By |
|-----------|---------|---------|
| `uploads/sliders/` | Slider/banner images | Slider management |
| `uploads/irrigation/` | Irrigation profile images (building scheme, network scheme, RTTG, planting schedule) | Irrigation profile management |
| `uploads/gallery/` | Gallery images | Gallery management |
| `uploads/news/` | News article images | News management |
| `uploads/employees/` | Employee profile photos | Employee management |

## 8. Nginx Static File Serving

Add a location block to serve uploaded files in your Nginx configuration:

```nginx
location /uploads/ {
    alias /var/www/bunta-bella-irrigation/backend/public/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

## 9. Database Backup

Always backup your database before running migrations or major updates.

### Option A: Using mysqldump (recommended, requires MySQL client)
```bash
mysqldump -h localhost -u bunta_user -p bunta_bella_production > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Option B: Using the Prisma backup script (portable, no MySQL client needed)
The project includes a portable backup script that exports all data as JSON:

```bash
cd /var/www/bunta-bella-irrigation/backend
node scripts/backup-database.js
```

This exports all 20 Prisma models (users, sliders, irrigation profiles, news, gallery, farmers, water level data, rainfall data, crop data, employees, etc.) into a timestamped JSON file saved in the `backups/` directory.

### Option C: Restore from JSON backup
To restore from a JSON backup, use a custom restore script or import via Prisma Studio:
```bash
cd backend && npx prisma studio
```

## 10. Monitoring and Maintenance

- View logs: `pm2 logs`
- Monitor processes: `pm2 monit`
- Check API health: `curl https://be.irigasibunta.com/api/health`
- Update the application: pull the latest changes and rerun `./deploy.sh`, then restart PM2 processes:

```bash
git pull
./deploy.sh
pm2 restart bunta-frontend bunta-backend
```

## 11. Troubleshooting

### Frontend not loading
Check that the frontend is running on port 3000:
```bash
curl http://localhost:3000
```

### API requests failing
Verify the backend is running on port 5001:
```bash
curl http://localhost:5001/api/health
```

### File upload returns "Unexpected field" (500 error)
The backend uses `upload.single('file')` for all upload endpoints.
- Frontend FormData must use `'file'` as the field name (not `'image'`)
- Verify the upload subdirectory exists (e.g., `uploads/irrigation/`)
- Check directory permissions are 755

### Images not displaying after upload
- Verify the file exists in the correct upload subdirectory
- Ensure Nginx is configured to serve `/uploads/` static files
- Restart Nginx: `sudo systemctl restart nginx`

### Nginx errors
Check Nginx error logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

### Database connection issues
Ensure MySQL is running and the credentials in `.env` are correct:
```bash
sudo systemctl status mysql
```

## 12. Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Beginner’s Guide](https://nginx.org/en/docs/beginners_guide.html)
- [Let’s Encrypt Documentation](https://certbot.eff.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)

---

**Note:** This guide is a starting point. Adjust paths, ports, and settings according to your specific server environment.