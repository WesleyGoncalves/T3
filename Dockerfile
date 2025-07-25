# https://docs.docker.com/build/concepts/dockerfile/
FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]