FROM node:20-alpine as build

WORKDIR /client

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build


FROM nginx:alpine

COPY --from=build /client/dist/browser /usr/share/nginx/html

# COPY default.conf /etc/nginx/conf.d

EXPOSE 80
