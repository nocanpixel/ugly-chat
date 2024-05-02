FROM node:20-alpine AS builder
WORKDIR /app

ENV VITE_API_URL=http://localhost/api
ENV VITE_LOGGED_COOKIE=pedal-cache-logged-in
ENV VITE_CLIENT_ERRORS=errors
ENV VITE_SOCKET_SERVER=http://localhost

COPY ./package.json ./
RUN npm install

COPY . .
RUN npm run build

# FROM nginx

# EXPOSE 8080
# COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=builder /app/dist /usr/share/nginx/html
