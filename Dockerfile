# Production Dockerfile that caches
# project dependencies at build time

# TODO: inline everything with `deno bundle` at build time?

FROM denoland/deno:1.15.3

ARG postgres_host
ARG postgres_user
ARG postgres_password
ARG postgres_db
ARG postgres_pool_connections

COPY . /microservice
WORKDIR /microservice
USER deno

ENV POSTGRES_HOST=$postgres_host
ENV POSTGRES_USER=$postgres_user
ENV POSTGRES_PASSWORD=$postgres_password
ENV POSTGRES_DB=$postgres_db
ENV POSTGRES_POOL_CONNECTIONS=$postgres_pool_connections

RUN ["deno", "cache", "deps.ts"]
EXPOSE 8000
CMD ["run", "--allow-env", "--allow-net", "service/server.ts"]
