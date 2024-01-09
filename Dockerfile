# pull official base image
FROM node:18-alpine AS build

# set working directory
WORKDIR /usr/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /usr/app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install --immutable

# add app
COPY . .

RUN npm ci
RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine3.18

RUN rm -rf /etc/nginx/html/*
COPY --from=build --chown=nginx:nginx /usr/app/dist /etc/nginx/html
COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
# start app
CMD ["nginx", "-g", "daemon off;"]
