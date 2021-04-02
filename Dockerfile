# pull base image
FROM node:10-alpine
# set working directory
WORKDIR /usr/src/app
# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH
# install app and dependencies
COPY package*.json ./
COPY . .
RUN apk add --no-cache --virtual node_gyp python make g++ \
 && npm install --only=production\
 && apk del node_gyp
EXPOSE 8080
# start app
CMD ["node", "app.js"]



