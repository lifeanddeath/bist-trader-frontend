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

# Nginx config for SPA - Domain support (80, 443, 3000) with SSL
RUN echo 'server { \
    listen 80; \
    listen 3000; \
    server_name cartcurtlarca.com www.cartcurtlarca.com _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # HTTP to HTTPS redirect (if SSL cert exists) \
    if ($host = cartcurtlarca.com) { \
        return 301 https://$host$request_uri; \
    } \
    if ($host = www.cartcurtlarca.com) { \
        return 301 https://$host$request_uri; \
    } \
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
        proxy_pass http://backend:8000/; \
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
} \
\
server { \
    listen 443 ssl http2; \
    server_name cartcurtlarca.com www.cartcurtlarca.com; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # SSL Certificate (mounted from host) \
    ssl_certificate /etc/nginx/ssl/cert.pem; \
    ssl_certificate_key /etc/nginx/ssl/key.pem; \
    \
    # SSL Configuration \
    ssl_protocols TLSv1.2 TLSv1.3; \
    ssl_prefer_server_ciphers on; \
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384; \
    ssl_session_cache shared:SSL:10m; \
    ssl_session_timeout 10m; \
    \
    # Security Headers \
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always; \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
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
        proxy_pass http://backend:8000/; \
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

EXPOSE 80 443 3000

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

CMD ["nginx", "-g", "daemon off;"]

