#!/bin/sh
set -eu

sed -i "s#change-landscape-url#$LANDSCAPE_URL#g" /usr/share/nginx/html/index.html
sed -i "s#change-trace-url#$TRACE_URL#g" /usr/share/nginx/html/index.html
sed -i "s#change-user-url#$USER_URL#g" /usr/share/nginx/html/index.html
sed -i "s#change-collab-url#$COLLAB_URL#g" /usr/share/nginx/html/index.html
sed -i "s#change-vr-url#$VR_URL#g" /usr/share/nginx/html/index.html
sed -i "s#change-frontend-host-name#$FRONTEND_HOST_NAME#g" /usr/share/nginx/html/index.html

exec "$@"
