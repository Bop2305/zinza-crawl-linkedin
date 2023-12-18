FROM node:20-alpine3.17

WORKDIR /apis

# RUN npm install -g @nestjs/cli

COPY package*.json ./

RUN yarn install

COPY . .

# RUN yarn build

CMD ["yarn", "run", "start:dev"]
