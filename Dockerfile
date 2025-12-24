FROM nginx:stable-alpine

# Replace default nginx config to listen on 8080 (Fly uses internal port)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static site
COPY . /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
