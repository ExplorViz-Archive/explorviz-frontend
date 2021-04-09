FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY dist /usr/share/nginx/html
COPY explorviz-nginx.conf /etc/nginx/conf.d

CMD ["nginx", "-g", "daemon off;"]
