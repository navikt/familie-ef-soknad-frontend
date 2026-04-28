FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:24-slim

WORKDIR /app
COPY ./build build
COPY ./server server

WORKDIR /app/server
ENV NODE_ENV production
ENV NPM_CONFIG_CACHE /tmp
EXPOSE 8080

CMD ["--import=./build/register.js", "--es-module-specifier-resolution=node", "build/server.js"]
