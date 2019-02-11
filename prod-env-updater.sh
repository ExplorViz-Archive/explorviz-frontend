sed -i "s#\/change-rootURL#$ROOT_URL#g" /usr/share/nginx/html/index.html
sed -i "s#change-API_ROOT#$API_ROOT#g" /usr/share/nginx/html/index.html

sed -i "s#API_ROOT_LANDSCAPE#$API_ROOT_LANDSCAPE#g" /etc/nginx/conf.d/explorviz-nginx.conf
sed -i "s#API_ROOT_USER#$API_ROOT_USER#g" /etc/nginx/conf.d/explorviz-nginx.conf
sed -i "s#API_ROOT_DISCOVERY#$API_ROOT_DISCOVERY#g" /etc/nginx/conf.d/explorviz-nginx.conf