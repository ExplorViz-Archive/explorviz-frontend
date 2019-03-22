FROM nginx:alpine

ENV ROOT_URL=
ENV API_ROOT=change-API_ROOT

# Attention: DNS docker service name 
# must match docker-compose of 
# docker-configuration repository

ENV API_ROOT_LANDSCAPE=http://landscape-service:8081
ENV API_ROOT_USER=http://user-service:8082
ENV API_ROOT_DISCOVERY=http://discovery-service:8083

COPY prod-env-updater.sh .
RUN chmod +x ./prod-env-updater.sh

COPY dist /usr/share/nginx/html
COPY explorviz-nginx.conf /etc/nginx/conf.d

RUN rm /etc/nginx/conf.d/default.conf

CMD ./prod-env-updater.sh && nginx -g "daemon off;"