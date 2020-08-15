FROM hayd/alpine-deno:1.3.0

COPY . /microservice
WORKDIR /microservice
USER deno

RUN ["deno", "cache", "deps.ts"]
EXPOSE 8000
CMD ["run", "--allow-env", "--allow-net", "service/server.ts"]
