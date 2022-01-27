FROM node:14-alpine

# equivalent de cd
WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install

COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
