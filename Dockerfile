# Production Dockerfile that caches
# project dependencies at build time

# TODO: inline everything with `deno bundle` at build time?

FROM denoland/deno:1.15.3

COPY . /microservice
WORKDIR /microservice
USER deno

RUN ["deno", "cache", "deps.ts"]
EXPOSE 8000
CMD ["run", "--allow-env", "--allow-net", "service/server.ts"]
