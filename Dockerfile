FROM node:lts
WORKDIR /usr/app
COPY package.json ./
COPY yarn.lock ./
COPY dist ./dist
COPY node_modules ./node_modules
CMD ["yarn", "start"]