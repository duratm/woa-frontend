# pull official base image
FROM node:18-alpine AS builder

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install --immutable

# add app
COPY . .

RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine3.18

RUN rm -rf /etc/nginnx/html/*
COPY --from=builder --chown=nginx:nginx /app/dist/* /etc/nginx/html
COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf

EXPOSE 3333
# start app
CMD ["nginx", "-g", "daemon off;"]
