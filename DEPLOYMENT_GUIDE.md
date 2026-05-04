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

> **Important:** The user `bunta_user` must have `CREATE, ALTER, DROP, INDEX, REFERENCES` privileges on the database for Prisma migrations to work. The `ALL PRIVILEGES` grant above covers this.

## 3. Application Deployment

Clone the repository (if not already present) and navigate into the project directory:

```bash
git clone <your-repo-url> /var/www/bunta-bella-irrigation
cd /var/www/bunta-bella-irrigation
```

### 3.1 Environment Configuration ⚠️ (CRITICAL — must be done BEFORE running deploy.sh)

Copy the production environment templates and fill in your actual values:

```bash
cp backend/.env.production backend/.env
cp frontend/.env.production frontend/.env
```

Edit both files with a text editor (nano/vim) and replace placeholders:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL production connection string | `mysql://bunta_user:your_password@localhost:3306/bunta_bella_production` |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` | `W4vR7pF9sB2kM8xQ3jL6tN1cA5dE7gH0=` |
| `NEXTAUTH_URL` | Frontend production domain | `https://irigasibunta.com` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Valid Google Maps API key | `AIzaSy...` |
| `CORS_ORIGINS` | Allowed frontend origins (comma-separated) | `https://irigasibunta.com,https://www.irigasibunta.com` |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `https://be.irigasibunta.com` |

> **⚠️ IMPORTANT:** Do NOT skip this step. The `.env` file must exist **before** running `deploy.sh`, because Prisma commands (generate, migrate) and the seed script all need `DATABASE_URL` to connect to your database.

### 3.2 Run Deployment Script (Recommended)

Run the deployment script, which handles everything automatically:

```bash
./deploy.sh
```

This script performs the following steps in order:

1. Install root dependencies (if any)
2. Install backend dependencies (`backend/`)
3. Install frontend dependencies (`frontend/`)
4. Generate Prisma client
5. **Apply database migrations** (`prisma migrate deploy`)
6. **Seed the database** with essential data (permissions, roles, users, categories, employees, irrigation profiles)
7. Set up upload directories
8. Build the frontend application
9. Restart PM2 processes

> **⚠️ Troubleshooting:** If `deploy.sh` fails mid-way (e.g., at the migration or seed step), ensure your `DATABASE_URL` in `backend/.env` is correct and MySQL is running. The `cd backend && command && cd ..` pattern used in the script means a failure may leave the terminal in the `backend/` directory — you can fix this by running `cd /var/www/bunta-bella-irrigation` to return to the project root before re-running.

### 3.3 Manual Steps (Alternative)

If you prefer to run steps manually instead of using `deploy.sh`:

```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 2. Generate Prisma client
cd backend && npx prisma generate && cd ..

# 3. Apply database migrations
cd backend && npx prisma migrate deploy && cd ..

# 4. ⚠️ CRITICAL: Seed the database with initial data
# This creates permissions, roles, admin users, categories, employees, and irrigation profiles.
cd backend && node scripts/seed-all-in-one.js && cd ..

# 5. Set up upload directories
node backend/scripts/fix-upload-directories.js

# 6. Build the frontend
cd frontend && npm run build && cd ..
```

> **⚠️ VERY IMPORTANT:** Step 4 (seed) is **required** for the application to function. Without it, there will be **no users, roles, or permissions** in the database, making the admin panel completely inaccessible. The seed script creates:
> - **105+ system permissions** covering all features (news, users, roles, categories, media, gallery, data, settings, dashboard, reports, storage, farmer groups, contact submissions, irrigation, sliders, employees, irrigation profiles)
> - **SUPER_ADMIN role** — full system access
> - **ADMIN role** — full system access
> - **Super Admin user**: `su.admin@irigasibunta.com` / `Buntamengalir25!`
> - **Admin user**: `admin@buntabella.go.id` / `admin123`
> - **4 news categories** (Berita, Pengumuman, Artikel, Kegiatan)
> - **15 sample employees** with positions and departments
> - **15 irrigation profiles** with locations and status data

## 4. Process Management with PM2

The project includes an [`ecosystem.config.js`](ecosystem.config.js) file that configures both services. Use it to start or restart:

```bash
cd /var/www/bunta-bella-irrigation
pm2 start ecosystem.config.js --env production
```

**What gets started:**

| Service | Port | Script |
|---------|------|--------|
| `bunta-frontend` (cluster mode, max instances) | 3000 | `npm start` (Next.js) |
| `bunta-backend` (fork mode, 1 instance) | 5001 | `npm start` (Express) |

Save the PM2 process list so it persists after reboot:

```bash
pm2 save
pm2 startup
```

> **Legacy method** (if you prefer to start processes individually):
> ```bash
> cd /var/www/bunta-bella-irrigation/backend && pm2 start npm --name "bunta-backend" -- start
> cd /var/www/bunta-bella-irrigation/frontend && pm2 start npm --name "bunta-frontend" -- start
> ```

## 5. Nginx Configuration

Copy the provided Nginx configuration to the appropriate site-enabled directory:

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
- SSL certificate paths (if using Let's Encrypt, see section 7)

Test the configuration and restart Nginx:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## 6. Upload Directory Setup

Upload files are stored in the **frontend** directory (all multer routes save to `frontend/public/uploads/`). Create the required subdirectories:

```bash
# Create all upload subdirectories under frontend/public/
sudo mkdir -p /var/www/bunta-bella-irrigation/frontend/public/uploads
sudo mkdir -p /var/www/bunta-bella-irrigation/frontend/public/uploads/sliders
sudo mkdir -p /var/www/bunta-bella-irrigation/frontend/public/uploads/irrigation
sudo mkdir -p /var/www/bunta-bella-irrigation/frontend/public/uploads/gallery
sudo mkdir -p /var/www/bunta-bella-irrigation/frontend/public/uploads/news
sudo mkdir -p /var/www/bunta-bella-irrigation/frontend/public/uploads/employees
sudo mkdir -p /var/www/bunta-bella-irrigation/frontend/public/uploads/storage
sudo mkdir -p /var/www/bunta-bella-irrigation/frontend/public/uploads/media

# Set ownership and permissions
sudo chown -R www-data:www-data /var/www/bunta-bella-irrigation/frontend/public/uploads
sudo chmod -R 755 /var/www/bunta-bella-irrigation/frontend/public/uploads
```

> **Note:** The `deploy.sh` script automatically runs `fix-upload-directories.js` which creates these directories, but the permissions step (`chown www-data`) must be done manually for Nginx to serve them correctly.

### Upload Subdirectory Reference

| Directory | Purpose | Used By |
|-----------|---------|---------|
| `frontend/public/uploads/sliders/` | Slider/banner images | Slider management |
| `frontend/public/uploads/irrigation/` | Irrigation profile images (building scheme, network scheme, RTTG, planting schedule) | Irrigation profile management |
| `frontend/public/uploads/gallery/` | Gallery images | Gallery management |
| `frontend/public/uploads/news/` | News article images | News management |
| `frontend/public/uploads/employees/` | Employee profile photos | Employee management |
| `frontend/public/uploads/storage/` | General file storage | Storage management |
| `frontend/public/uploads/media/` | Media library files | Media management |

## 7. Nginx Static File Serving for Uploads

Add a location block to serve uploaded files in your Nginx configuration (`/etc/nginx/sites-available/bunta-bella-irrigation`):

```nginx
# Serve uploaded files from frontend/public/uploads/
location /uploads/ {
    alias /var/www/bunta-bella-irrigation/frontend/public/uploads/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

> **⚠️ Path correction:** The uploads directory is under `frontend/public/uploads/`, NOT `backend/public/uploads/`. All multer middleware in the backend routes save files to `frontend/public/uploads/`.

## 8. SSL Certificate (Let's Encrypt)

Install Certbot and obtain a free SSL certificate:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow the interactive prompts. Certbot will automatically update your Nginx configuration.

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

This exports all 18 Prisma models (users, sliders, irrigation profiles, news, gallery, farmers, water level data, rainfall data, crop data, employees, permissions, roles, etc.) into a timestamped JSON file saved in the `backups/` directory.

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

### "ECONNREFUSED" or database connection errors in seed/migration
Ensure MySQL is running and the credentials in `backend/.env` are correct:
```bash
sudo systemctl status mysql
# Test the connection string manually:
mysql -u bunta_user -p -h localhost bunta_bella_production -e "SELECT 1"
```

### Seed script fails with "unique constraint" or duplicate errors
The [`seed-all-in-one.js`](backend/scripts/seed-all-in-one.js) script uses `upsert` for users and roles, and `deleteMany` before inserting employees/irrigation profiles. If it still fails, the database may have partial data from a previous failed seed. Run the seed again — it is idempotent for permissions, roles, and users.

### File upload returns "Unexpected field" (500 error)
The backend uses `upload.single('file')` for all upload endpoints.
- Frontend FormData must use `'file'` as the field name (not `'image'` or `'photo'`)
- Verify the upload subdirectory exists (e.g., `frontend/public/uploads/irrigation/`)
- Check directory permissions are 755

### Images not displaying after upload
- Verify the file exists in the correct upload subdirectory under `frontend/public/uploads/`
- Ensure Nginx is configured to serve `/uploads/` static files (see section 7)
- Restart Nginx: `sudo systemctl restart nginx`

### Nginx errors
Check Nginx error logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

### PM2 processes not starting after deploy.sh
If `deploy.sh` fails, PM2 processes may not restart. Manually start them:
```bash
cd /var/www/bunta-bella-irrigation
pm2 start ecosystem.config.js --env production
pm2 save
```

### Seed fails with "column does not exist" error (Schema Drift)
The Prisma schema has fields that were added after the last migration was generated, causing **schema drift**. The error looks like:

```
The column `databasename.employees.tanggalPengangkatan` does not exist in the current database.
```

This happens because the Prisma Client was generated from [`schema.prisma`](backend/prisma/schema.prisma) (which has the new fields), but the actual database tables are missing those columns. A fix migration has been provided at [`backend/prisma/migrations/20260504200000_add_missing_schema_columns/`](backend/prisma/migrations/20260504200000_add_missing_schema_columns/).

**Fix:**

```bash
# 1. Apply the new migration to add missing columns
cd /var/www/bunta-bella-irrigation/backend
npx prisma migrate deploy

# 2. Re-run the seed (it will now work)
node scripts/seed-all-in-one.js
```

**Affected tables and missing columns:**

| Table | Missing Columns |
|-------|----------------|
| `employees` | `tanggalPengangkatan` |
| `irrigation_profiles` | `regency`, `constructionYear`, `servedVillages`, `potentialArea`, `functionalArea`, `dischargeCapacity`, `channelLength`, `watershedArea`, `productivity`, `totalStructures`, `mainStructure`, `divisionStructure`, `intakeStructure`, `dropStructure`, `aqueduct`, `drainageCulvert`, `roadCulvert`, `slopingDrain`, `buildingScheme`, `networkScheme`, `p3aGroupList` (JSON), `farmingBusinessAnalysis` (JSON), `rttg`, `plantingSchedule` |
| `sliders` | `buttonText` |

> **Note:** On a fresh database, `prisma migrate deploy` applies ALL migrations in order, including this new fix migration, so the seed will work on the first try.

## 12. Database Schema History

The project uses Prisma migrations stored in [`backend/prisma/migrations/`](backend/prisma/migrations/). The migration history includes:

| Migration | Description |
|-----------|-------------|
| `20250905161738_init_mysql` | Initial schema: users, accounts, sessions, verification tokens, news, categories, pages, media, sliders, gallery |
| `20250905171730_add_irrigation_data_models` | Added water_level_data, rainfall_data, crop_data, farmer_data tables |
| `20250917224803_add_farmer_model` | Added farmers table with group/chairman/members fields |
| `20250921185247_add_contact_submissions` | Added contact_submissions table |
| `20250921194303_add_file_storage` | Added file_storage table, dropped media table |
| `20250927203851_change_news_content_to_longtext` | Changed news content column to LONGTEXT |
| `20260420190123_update_schema` | Added employees and irrigation_profiles tables, dropped media and pages tables, added roleId and role/permission system |
| `20260420204854_baseline` | Baseline empty migration for schema reset alignment |
| `20260504200000_add_missing_schema_columns` | **Fix migration:** Adds missing columns to `employees` (`tanggalPengangkatan`), `irrigation_profiles` (24 fields: regency, constructionYear, servedVillages, potentialArea, functionalArea, etc.), and `sliders` (`buttonText`) that were added to the schema but not migrated |

> **Note:** The `baseline` migration is intentionally empty. It was created to reset the migration history baseline. The full schema is defined in [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma). If you encounter "column does not exist" errors during seeding, apply the `20260504200000_add_missing_schema_columns` migration (see troubleshooting section 11).

## 13. Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)
- [Let's Encrypt Documentation](https://certbot.eff.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs)

---

**Note:** This guide is a starting point. Adjust paths, ports, and settings according to your specific server environment.
