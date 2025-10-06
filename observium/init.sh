#!/bin/bash
set -e

# make dirs
mkdir -p /opt/observium/logs /opt/observium/rrd
chmod 777 /opt/observium/logs /opt/observium/rrd

# create log file
touch /opt/observium/logs/observium.log

# configure Apache
sed -i 's|Listen 80|Listen 8668|' /etc/apache2/ports.conf
sed -i 's|/var/www/html|/opt/observium/html|' /etc/apache2/sites-available/000-default.conf

# init database Observium
if [ ! -f /opt/observium/.db_init ]; then
    /opt/observium/discovery.php -u || true
    touch /opt/observium/.db_init
fi

a2dissite 000-default.conf || true
a2ensite observium.conf
a2enmod rewrite

# service apache2 start
# service cron start

#echo "ServerName localhost" >> /etc/apache2/apache2.conf
#exec apache2ctl -D FOREGROUND

tail -f /opt/observium/logs/observium.log
