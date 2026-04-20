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

Ensure the upload directory exists and is writable:

```bash
sudo mkdir -p /var/www/bunta-bella-irrigation/backend/public/uploads
sudo chown -R www-data:www-data /var/www/bunta-bella-irrigation/backend/public/uploads
sudo chmod -R 755 /var/www/bunta-bella-irrigation/backend/public/uploads
```

## 8. Monitoring and Maintenance

- View logs: `pm2 logs`
- Monitor processes: `pm2 monit`
- Update the application: pull the latest changes and rerun `./deploy.sh`, then restart PM2 processes:

```bash
pm2 restart bunta-frontend bunta-backend
```

## 9. Troubleshooting

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

### Nginx errors
Check Nginx error logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

### Database connection issues
Ensure MySQL is running and the credentials in `.env` are correct.

## 10. Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Beginner’s Guide](https://nginx.org/en/docs/beginners_guide.html)
- [Let’s Encrypt Documentation](https://certbot.eff.org/docs/)

---

**Note:** This guide is a starting point. Adjust paths, ports, and settings according to your specific server environment.