FROM node:24-alpine

WORKDIR /zurich-meets-tanzania

COPY package*.json .

COPY dist dist
COPY public public

RUN mkdir cert

RUN npm install --omit=dev
RUN npm cache clean --force

CMD ["node", "dist/server/server.mjs"]