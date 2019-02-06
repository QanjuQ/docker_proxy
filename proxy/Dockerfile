FROM node:8-alpine
WORKDIR /usr/app/
COPY ./package.json .
RUN npm install
COPY ./server.js .
EXPOSE 9000
CMD [ "npm", "start" ]
