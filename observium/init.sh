#!/bin/bash
set -e

echo "🔧 Starting Observium init..."

# Проверяем конфиг Apache
a2enmod rewrite
a2ensite observium.conf
a2dissite 000-default.conf

# Проверяем, запущен ли Apache
service apache2 stop || true

# Ждем БД (если она в другом контейнере)
echo "⏳ Waiting for database..."
until mysql -h "$OBS_DB_HOST" -u "$OBS_DB_USER" -p"$OBS_DB_PASS" -e "SELECT 1;" &> /dev/null; do
  echo "  > Database not ready, waiting 5s..."
  sleep 5
done

# Проверяем, установлена ли схема
if ! mysql -h "$OBS_DB_HOST" -u "$OBS_DB_USER" -p"$OBS_DB_PASS" "$OBS_DB_NAME" -e "SHOW TABLES;" | grep -q 'devices'; then
  echo "🧩 Installing Observium DB schema..."
  cd /opt/observium
  php includes/sql-schema/update.php
fi

# Запускаем крон
service cron start

# Запускаем Apache
echo "🚀 Starting Apache..."
apachectl -D FOREGROUND
