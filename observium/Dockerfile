FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    apache2 \
    php php-cli php-mysql php-gd php-snmp php-xml php-mbstring \
    snmp graphviz fping mariadb-client \
    rrdtool whois mtr-tiny ipmitool python3-mysqldb git wget cron unzip && \
    rm -rf /var/lib/apt/lists/*

# install Observium Community Edition
WORKDIR /opt
RUN wget http://www.observium.org/observium-community-latest.tar.gz && \
    tar zxvf observium-community-latest.tar.gz && \
    rm observium-community-latest.tar.gz

# set Main DocumentRoot Apache
RUN cp -r /opt/observium/html/* /var/www/html/ && \
    chown -R www-data:www-data /var/www/html/

WORKDIR /opt/observium

RUN mkdir -p logs rrd && chmod 777 logs rrd

# config Observium
COPY config.php /opt/observium/config.php
COPY apache/observium.conf /etc/apache2/sites-available/observium.conf

# cron + web
COPY init.sh /opt/observium/init.sh
RUN chmod +x /opt/observium/init.sh

RUN a2enmod rewrite

EXPOSE 80
EXPOSE 8668

CMD ["/opt/observium/init.sh"]
# CMD ["apache2ctl", "-D", "FOREGROUND"]
