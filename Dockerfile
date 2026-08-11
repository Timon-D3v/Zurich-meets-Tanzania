FROM node:24-slim

WORKDIR /zurich-meets-tanzania

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

# RUN npm install --omit=dev
# RUN npm cache clean --force

COPY dist ./dist
COPY public ./public

RUN mkdir cert

CMD ["node", "dist/server/server.mjs"]