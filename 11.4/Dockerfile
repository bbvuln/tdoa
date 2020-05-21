FROM php:5.4.45-apache

ADD php.ini /usr/local/etc/php/php.ini
ADD ZendGuardLoader.so /var/www/ZendGuardLoader.so
ADD html /var/www/html
ADD attach_logs.tar.gz /var/www

RUN apt-get update -y && apt-get install -y \
    libjpeg-dev \
    libpng-dev \
    libzip-dev
    

RUN docker-php-ext-install gd \
    && docker-php-ext-install zip \
    && docker-php-ext-install mysql \
    && docker-php-ext-install mysqli \
    && docker-php-ext-install sockets \
    && docker-php-ext-install mbstring

# install phpredis extension
ENV PHPREDIS_VERSION 2.2.8

ADD https://github.com/phpredis/phpredis/archive/$PHPREDIS_VERSION.tar.gz /tmp/redis.tar.gz
RUN tar xzf /tmp/redis.tar.gz -C /tmp \
    && mkdir -p /usr/src/php/ext \
    && mv /tmp/phpredis-$PHPREDIS_VERSION /usr/src/php/ext/redis \
    && echo 'redis' >> /usr/src/php-available-exts \
    && docker-php-ext-install redis \
    && rm -rf /usr/src/php/ext/redis

RUN chmod -R 777 /var/www
