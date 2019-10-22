sed -i "s#change-API_ROOT#$API_ROOT#g" /usr/share/nginx/html/index.html

sed -i "s#API_ROOT#$API_ROOT#g" /etc/nginx/conf.d/explorviz-nginx.conf