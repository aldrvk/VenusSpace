# Menggunakan PHP 8.3 dengan Apache (Paling stabil untuk container tunggal)
FROM php:8.3-apache

# 1. Install sistem dependensi dan ekstensi PHP mutlak untuk Laravel & Filament
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    libicu-dev \
    zip \
    unzip \
    git \
    curl \
    nodejs \
    npm

# 2. Konfigurasi dan install ekstensi PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql gd zip intl bcmath

# 3. Aktifkan mod_rewrite Apache untuk routing Laravel
RUN a2enmod rewrite

# 4. Ubah DocumentRoot Apache ke folder public Laravel
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# 5. Modifikasi port agar mematuhi dynamic $PORT dari infrastruktur Railway
RUN sed -i 's/Listen 80/Listen ${PORT}/g' /etc/apache2/ports.conf
RUN sed -i 's/<VirtualHost \*:80>/<VirtualHost \*:${PORT}>/g' /etc/apache2/sites-available/000-default.conf

# 6. Set direktori kerja
WORKDIR /var/www/html

# 7. Salin seluruh source code ke dalam container
COPY . .

# 8. Install dependensi PHP via Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# 9. Install dependensi Node.js dan build aset frontend (Vite/UI)
RUN npm install && npm run build

# 10. Berikan hak akses mutlak pada direktori cache dan storage
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Railway akan mengeksekusi container ini sesuai $PORT yang ditentukan secara dinamis