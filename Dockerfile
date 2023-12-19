FROM node:20-alpine3.17
FROM alpine

COPY package*.json ./

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /apis

COPY . .

RUN yarn install
RUN yarn add puppeteer

# RUN yarn build
CMD ["yarn", "run", "start:dev"]
