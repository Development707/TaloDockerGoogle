FROM node:14-alpine as build

WORKDIR /app

COPY . .
RUN npm install

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

ARG REACT_APP_URL
ENV REACT_APP_URL=$REACT_APP_URL

ARG REACT_APP_SOCKET_URL
ENV REACT_APP_SOCKET_URL=$REACT_APP_SOCKET_URL

RUN npm run build

FROM nginx

COPY --from=build /app/build /usr/share/nginx/html

COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

CMD [ "nginx", "-g", "daemon off;" ]