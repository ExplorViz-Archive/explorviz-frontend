FROM nginx:alpine

ENV FRONTEND_IP=http://localhost:8090
ENV API_ROOT=change-API_ROOT

COPY prod-env-updater.sh .
RUN chmod +x ./prod-env-updater.sh

COPY dist /usr/share/nginx/html
COPY explorviz-nginx.conf /etc/nginx/conf.d

RUN rm /etc/nginx/conf.d/default.conf

CMD ./prod-env-updater.sh && nginx -g "daemon off;"