FROM navikt/node-express:16

USER root

WORKDIR /app
COPY ./build build
COPY ./server server

WORKDIR /app/server

ARG NPM_TOKEN
RUN npm ci
RUN npm build

EXPOSE 8080

USER apprunner

CMD ["npm", "start:server"]