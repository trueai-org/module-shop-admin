

docker build -t shop-web-nginx:dev-1.0.0-beta2 .

docker run -dit --name shop-web-nginx -p 6002:80 --restart=always shop-web-nginx:dev-1.0.0-beta2
