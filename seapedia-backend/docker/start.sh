#!/bin/sh
set -eu

if [ -z "${APP_KEY:-}" ]; then
    echo "APP_KEY belum diisi. Salin dari .env backend ke Environment Render." >&2
    exit 1
fi

if [ -z "${DB_URL:-}" ]; then
    echo "DB_URL belum diisi. Gunakan connection string PostgreSQL Neon." >&2
    exit 1
fi

PORT="${PORT:-10000}"
case "$PORT" in
    ''|*[!0-9]*) echo "PORT harus berupa angka." >&2; exit 1 ;;
esac
if [ "$PORT" -lt 1 ] || [ "$PORT" -gt 65535 ]; then
    echo "PORT harus berada pada rentang 1-65535." >&2
    exit 1
fi
export PORT

# Render provides the public service URL before the application starts.
if [ -z "${APP_URL:-}" ]; then
    APP_URL="${RENDER_EXTERNAL_URL:-http://localhost:$PORT}"
    export APP_URL
fi

printf 'Listen %s\n' "$PORT" > /etc/apache2/ports.conf
mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs storage/app/public bootstrap/cache

# Never reuse a configuration cache from another environment.
php artisan config:clear

# Schema upgrades only: never reset the database or seed accounts on restart.
case "${RUN_MIGRATIONS:-true}" in
    true|1) php artisan migrate --force --no-interaction ;;
    false|0) ;;
    *) echo "RUN_MIGRATIONS harus true atau false." >&2; exit 1 ;;
esac

if [ ! -L public/storage ] && [ ! -e public/storage ]; then
    php artisan storage:link --no-interaction
fi
php artisan config:cache
php artisan route:cache
php artisan view:cache
chown -R www-data:www-data storage bootstrap/cache

exec apache2-foreground
