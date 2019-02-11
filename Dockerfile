FROM nginx:alpine

ENV ROOT_URL=
ENV API_ROOT=change-API_ROOT

ENV API_ROOT_LANDSCAPE=http://landscape:8081
ENV API_ROOT_USER=http://authentication:8082
ENV API_ROOT_DISCOVERY=http://discovery:8083

COPY prod-env-updater.sh .
RUN chmod +x ./prod-env-updater.sh

COPY dist /usr/share/nginx/html
COPY explorviz-nginx.conf /etc/nginx/nginx.conf

RUN rm /etc/nginx/conf.d/default.conf

CMD ./prod-env-updater.sh && nginx -g "daemon off;"