#!/bin/sh
set -eu

sed -i "s#change-landscape-url#$LANDSCAPE_URL#g" /usr/share/nginx/html/index.html
sed -i "s#change-trace-url#$TRACE_URL#g" /usr/share/nginx/html/index.html
sed -i "s#change-user-url#$USER_URL#g" /usr/share/nginx/html/index.html
sed -i "s#change-collab-url#$COLLAB_URL#g" /usr/share/nginx/html/index.html
sed -i "s#change-frontend-host-name#$FRONTEND_HOST_NAME#g" /usr/share/nginx/html/index.html
sed -i "s#change-auth0-logo-url#$AUTH0_LOGO_URL#g" /usr/share/nginx/html/index.html
sed -i "s#change-auth0-callback-url#$AUTH0_CALLBACK_URL#g" /usr/share/nginx/html/index.html
sed -i "s#change-auth0-logout-url#$AUTH0_LOGOUT_URL#g" /usr/share/nginx/html/index.html

exec "$@"
