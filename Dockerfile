FROM hayd/alpine-deno:1.2.0

COPY . /microservice
WORKDIR /microservice

RUN ["deno", "cache", "deps.ts"]

CMD ["run", "--allow-env", "--allow-net", "service/server.ts"]
