FROM node:18.6.0-alpine

RUN apk add graphicsmagick imagemagick \
    && yarn global add nodemon

# equivalent de cd
WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

CMD ["nodemon", "server.js"]
