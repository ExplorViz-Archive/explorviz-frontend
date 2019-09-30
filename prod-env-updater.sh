#sed -i "s#\/change-rootURL#$ROOT_URL#g" /usr/share/nginx/html/index.html
sed -i "s#change-API_ROOT#$API_ROOT#g" /usr/share/nginx/html/index.html

sed -i "s#logstash-host#$LOGSTASH_HOST#g" /usr/share/nginx/html/index.html

sed -i "s#logstash-enabled#$LOGSTASH_ENABLED#g" /usr/share/nginx/html/index.html

sed -i "s#API_ROOT_BROADCAST#$API_ROOT_BROADCAST#g" /etc/nginx/conf.d/explorviz-nginx.conf

sed -i "s#API_ROOT_HISTORY#$API_ROOT_HISTORY#g" /etc/nginx/conf.d/explorviz-nginx.conf

sed -i "s#API_ROOT_USER#$API_ROOT_USER#g" /etc/nginx/conf.d/explorviz-nginx.conf

sed -i "s#API_ROOT_DISCOVERY#$API_ROOT_DISCOVERY#g" /etc/nginx/conf.d/explorviz-nginx.conf

sed -i "s#API_ROOT_SETTINGS#$API_ROOT_SETTINGS#g" /etc/nginx/conf.d/explorviz-nginx.conf