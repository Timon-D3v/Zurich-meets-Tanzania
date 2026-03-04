FROM node:24.14.0-alpine3.23

WORKDIR /zurich-meets-tanzania-website

COPY package*.json .
COPY . .

RUN mkdir cert

RUN npm install --omit=dev
RUN npm cache clean --force

CMD ["node", "index.js"]