FROM nginx:stable-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy site files
COPY . /usr/share/nginx/html/

# Replace default nginx conf to ensure index routing
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
FROM nginx:stable-alpine

# Replace default nginx config to listen on 8080 (Fly uses internal port)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static site
COPY . /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
