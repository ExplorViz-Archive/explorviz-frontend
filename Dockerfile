FROM nginx:alpine

ENV ROOT_URL=
ENV API_ROOT=change-API_ROOT

ADD prod-env-updater.sh .
RUN chmod +x ./prod-env-updater.sh

COPY dist /usr/share/nginx/html

CMD ./prod-env-updater.sh && nginx -g "daemon off;"