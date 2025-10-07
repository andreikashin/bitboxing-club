# Use Ubuntu 20.04 as the base image
FROM ubuntu:20.04

# Set environment variables for non-interactive installation
ENV DEBIAN_FRONTEND=noninteractive

# Update and install dependencies for Observium (excluding MariaDB Server)
RUN apt-get update && apt-get install -y \
    apache2 \
    php \
    php-cli \
    php-mysql \
    php-gd \
    php-json \
    php-pear \
    snmp \
    fping \
    rrdtool \
    subversion \
    whois \
    mtr-tiny \
    ipmitool \
    graphviz \
    imagemagick \
    wget \
    cron \
    mariadb-client \
    && rm -rf /var/lib/apt/lists/*

# Download and extract Observium Community Edition
WORKDIR /opt
RUN wget http://www.observium.org/observium-community-latest.tar.gz && \
    tar zxf observium-community-latest.tar.gz && \
    rm observium-community-latest.tar.gz

WORKDIR /opt/observium

# Copy your custom config file and the entrypoint script
COPY config.php .
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
COPY apache/observium.conf /etc/apache2/sites-available/observium.conf

# Expose the Apache web server port
EXPOSE 80

# Set the entrypoint to run when the container starts
ENTRYPOINT ["/entrypoint.sh"]
# CMD ["apache2ctl", "-D", "FOREGROUND"]