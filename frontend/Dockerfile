FROM node:10.13-alpine
WORKDIR /var/www/
COPY . /var/www/
RUN [ "npm", "install" ]
EXPOSE 3000
CMD [ "npm", "start" ]