FROM node:12
WORKDIR /usr/app
COPY package.json ./
COPY yarn.lock ./
COPY dist ./dist
RUN yarn install
CMD ["yarn", "start"]