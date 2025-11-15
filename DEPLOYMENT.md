# FinGenie - cPanel Deployment Guide

This guide explains how to deploy FinGenie to cPanel using FTP via GitHub Actions.

## Prerequisites

1. A cPanel hosting account with FTP access
2. A GitHub repository for your project
3. FTP credentials (host, username, password)
4. PHP 8.2+ and MySQL database on your cPanel server

## GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

1. Go to your repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:

### Required Secrets:

- **`CPANEL_FTP_HOST`** - Your FTP server hostname (e.g., `ftp.yourdomain.com` or IP address)
- **`CPANEL_FTP_USERNAME`** - Your FTP username
- **`CPANEL_FTP_PASSWORD`** - Your FTP password
- **`CPANEL_DEPLOY_PATH`** - Deployment path (default: `/public_html/`)

### Example:
```
CPANEL_FTP_HOST: ftp.yourdomain.com
CPANEL_FTP_USERNAME: your_username
CPANEL_FTP_PASSWORD: your_secure_password
CPANEL_DEPLOY_PATH: /public_html/
```

## Deployment Process

### Automatic Deployment

The workflow automatically triggers on:
- Push to `main` or `master` branch
- Manual trigger via GitHub Actions UI

### What Gets Deployed

The workflow will:
1. ✅ Install Composer dependencies (production only)
2. ✅ Install NPM dependencies
3. ✅ Build frontend assets (Vite)
4. ✅ Create deployment package
5. ✅ Upload files to cPanel via FTP

### Excluded Files

The following are excluded from deployment:
- `.env` files
- `node_modules/`
- `tests/`
- `.git/` directories
- Documentation files

## Post-Deployment Steps

After the GitHub Actions workflow completes, you need to complete these steps on your cPanel server:

### 1. Upload Environment File

**Option A: Via cPanel File Manager**
1. Log into cPanel
2. Open File Manager
3. Navigate to `public_html/`
4. Upload your `.env` file
5. Set permissions to 644

**Option B: Via FTP Client**
1. Connect to your FTP server
2. Upload `.env` file to the root directory
3. Set permissions to 644

### 2. Configure Environment Variables

Edit your `.env` file with the following required settings:

```env
APP_NAME=FinGenie
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash-live
GEMINI_VISION_MODEL=gemini-2.0-flash-live
GEMINI_TEMPERATURE=0.7
GEMINI_MAX_TOKENS=2048
GEMINI_TIMEOUT=30
GEMINI_CACHE_ENABLED=true
GEMINI_CACHE_TTL=3600

# Session & Cache
SESSION_DRIVER=file
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
```

### 3. Set File Permissions

**Via cPanel File Manager:**
1. Navigate to `public_html/`
2. Right-click `storage` folder → Change Permissions → Set to `755`
3. Right-click `bootstrap/cache` folder → Change Permissions → Set to `755`
4. Right-click `public` folder → Change Permissions → Set to `755`

**Via SSH (if available):**
```bash
cd ~/public_html
chmod -R 755 storage bootstrap/cache
chmod -R 755 public
```

### 4. Run Artisan Commands

**Via cPanel Terminal (if available):**
```bash
cd ~/public_html
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Via SSH:**
```bash
cd ~/public_html
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Note:** If you don't have SSH/Terminal access, you can use cPanel's "PHP Selector" or create a temporary PHP file to run these commands.

### 5. Create Database

1. Log into cPanel
2. Open **MySQL Databases**
3. Create a new database
4. Create a database user
5. Add the user to the database with ALL PRIVILEGES
6. Update your `.env` file with the database credentials

### 6. Run Migrations

After setting up the database, run:
```bash
php artisan migrate --force
```

### 7. Verify Deployment

1. Visit your website URL
2. Check that the homepage loads
3. Test registration/login functionality
4. Verify AI features are working (check Gemini API key is set)

## Troubleshooting

### Common Issues

#### 1. 500 Internal Server Error
- Check file permissions (`storage` and `bootstrap/cache` should be 755)
- Verify `.env` file exists and is configured correctly
- Check Laravel logs: `storage/logs/laravel.log`

#### 2. Database Connection Error
- Verify database credentials in `.env`
- Ensure database user has proper permissions
- Check if database exists in cPanel

#### 3. Assets Not Loading
- Verify `public/build/` directory exists
- Check that `npm run build` completed successfully
- Clear browser cache

#### 4. Route Not Found
- Run `php artisan route:cache`
- Check `.htaccess` file exists in `public/` directory
- Verify mod_rewrite is enabled on server

#### 5. Permission Denied Errors
- Set correct permissions: `chmod -R 755 storage bootstrap/cache`
- Ensure web server user owns the files

### Checking Logs

View Laravel logs via:
- **cPanel File Manager:** Navigate to `storage/logs/laravel.log`
- **SSH:** `tail -f storage/logs/laravel.log`

## Manual Deployment (Alternative)

If you prefer to deploy manually:

1. **Build locally:**
   ```bash
   composer install --no-dev --optimize-autoloader
   npm ci
   npm run build
   ```

2. **Upload files via FTP:**
   - Upload all files except `node_modules/`, `.git/`, and `.env`
   - Ensure `vendor/` directory is uploaded

3. **Complete post-deployment steps** (see above)

## Security Notes

- ⚠️ Never commit `.env` file to Git
- ⚠️ Use strong database passwords
- ⚠️ Keep `APP_DEBUG=false` in production
- ⚠️ Regularly update dependencies
- ⚠️ Use HTTPS for your application

## Support

For issues or questions:
1. Check Laravel logs: `storage/logs/laravel.log`
2. Review GitHub Actions workflow logs
3. Verify all environment variables are set correctly

---

**Last Updated:** 2025-01-XX
**Version:** 1.0.0

