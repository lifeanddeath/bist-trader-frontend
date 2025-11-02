FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY frontend/ .

# Set API URL for React app (nginx will proxy /api/* to backend)
ENV REACT_APP_API_URL=/api

# Build
RUN npm run build

# Production server
FROM nginx:alpine

# Copy build output
COPY --from=build /app/build /usr/share/nginx/html

# Nginx config for SPA - Domain support (80, 443, 3000)
RUN echo 'server { \
    listen 80; \
    listen 3000; \
    server_name cartcurtlarca.com www.cartcurtlarca.com _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Timeout ayarları \
    proxy_connect_timeout 60s; \
    proxy_send_timeout 60s; \
    proxy_read_timeout 300s; \
    send_timeout 60s; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location /api/ { \
        proxy_pass http://backend:8000/api/; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
        proxy_cache_bypass $http_upgrade; \
        \
        # Timeout ayarları \
        proxy_connect_timeout 60s; \
        proxy_send_timeout 60s; \
        proxy_read_timeout 300s; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80 3000

CMD ["nginx", "-g", "daemon off;"]

