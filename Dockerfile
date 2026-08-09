FROM node:24-slim

WORKDIR /zurich-meets-tanzania

COPY package*.json .

RUN npm ci

COPY dist dist
COPY public public

RUN mkdir cert

#RUN npm install --omit=dev
#RUN npm cache clean --force

CMD ["node", "dist/server/server.mjs"]