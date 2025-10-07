#!/bin/bash
set -e

# --- WAIT FOR DATABASE CONTAINER ---
# Use mysqladmin to repeatedly check if the database is ready.
echo ">>> Waiting for database on host ${OBS_DB_HOST}..."
until mysqladmin ping -h"${OBS_DB_HOST}" -u"${OBS_DB_USER}" -p"${OBS_DB_PASS}" --silent; do
    echo "Database not ready, waiting 5 seconds..."
    sleep 5
done
echo ">>> Database is ready."
# --- END WAIT ---

# 1. Create RRD and log directories for Observium data
echo ">>> Creating RRD and log directories..."
mkdir -p /opt/observium/rrd /opt/observium/logs

# 2. Set correct ownership for the web server and cron jobs
chown -R www-data:www-data /opt/observium/rrd /opt/observium/logs

# 3. Initialize database schema on first run
if [ ! -f /opt/observium/rrd/.db_init ]; then
    echo ">>> First run detected. Initializing database schema..."
    /opt/observium/discovery.php -u || true
    /opt/observium/adduser.php admin admin 10
    touch /opt/observium/rrd/.db_init
    echo ">>> Database initialized and admin user created (admin/password)."
fi

# 4. Set up cron jobs for polling and discovery
echo ">>> Setting up cron jobs..."
(crontab -l -u www-data 2>/dev/null; echo "33 */6 * * * /opt/observium/discovery.php -h all >> /dev/null 2>&1") | crontab -u www-data -
(crontab -l -u www-data 2>/dev/null; echo "*/5 * * * * /opt/observium/poller-wrapper.py 8 >> /dev/null 2>&1") | crontab -u www-data -
service cron start

# 5. Configure and start Apache
echo ">>> Configuring and starting Apache..."
echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Disable default site
a2dissite 000-default.conf

# Enable your custom site config and the rewrite module
a2ensite observium.conf
a2enmod rewrite

# Start Apache in the foreground to keep the container running
exec apache2ctl -D FOREGROUND