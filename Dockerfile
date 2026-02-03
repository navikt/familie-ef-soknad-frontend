FROM gcr.io/distroless/nodejs24-debian12

WORKDIR /app
COPY ./build build
COPY ./server server

WORKDIR /app/server
ENV NODE_ENV production
EXPOSE 8080

CMD ["--import=./build/register.js", "--es-module-specifier-resolution=node", "build/server.js"]
