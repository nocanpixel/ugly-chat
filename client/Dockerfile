FROM node:20-alpine AS builder

ENV VITE_API_URL=https://lotshat.com/api
ENV VITE_LOGGED_COOKIE=pedal-cache-logged-in
ENV VITE_CLIENT_ERRORS=errors
ENV VITE_SOCKET_SERVER=https://lotshat.com

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

RUN npm run build

FROM nginx

EXPOSE 8080
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
