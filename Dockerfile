FROM node:lts-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "app/app.js"]

FROM node:lts-alpine as production
COPY —from=build /app/dist /


CMD ["node", "app/app.js"]