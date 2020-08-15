# Blog Microservice

[![CI](https://github.com/reno-router/blog-microservice/workflows/CI/badge.svg?branch=master)](https://github.com/reno-router/blog-microservice/actions?query=workflow%3ACI)

An example Reno microservice for creating and fetching blog posts from a PostgreSQL database.

## Running Locally

This repo includes a [Docker Compose](https://docs.docker.com/compose/) [configuration](https://github.com/reno-router/blog-microservice/blob/master/docker-compose.yml) and a [dedicated Dockerfile for local development](https://github.com/reno-router/blog-microservice/blob/master/Dockerfile.local), which together will:

* run a Postgres container, boostrapped with the [provided SQL initialisation and seed scripts](https://github.com/reno-router/blog-microservice/tree/master/data)
* create a local network that's shared by both the database and microservice containers
* start the microservice via [Denon](https://github.com/denosaurs/denon), automatically restarting whenever the source code changes

If you haven't already, [install Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/), after which it's simply a case of running `docker-compose up`; the service will be available on port 8000, against which any of the requests under [_Operations_](#operations) can be made.

```
$ curl http://localhost:8000/posts
```

### Developer Experience Protip

You can install the Deno dependencies and their accompanying TypeScript definitions onto your host machine by running `deno cache deps.ts`; this isn't a prerequisite to running the service, but will allow your TS-enabled editor to discover said definitions, vastly improving the local development experience.

## Unit Tests

This project has extensive unit test coverage. The test suite can be invoked with `deno test`.


## Operations

### `GET /posts`

Retrieves metadata for all of the posts in the database.

### `GET /posts/<UUID>`

Retrieves the metadata and content of the post with the given UUID.

### `POST /posts`

Adds a new post to the database.

#### Request body

```json
{
  "title": "My new post",
  "contents": "Here's the content body of my post",
  "authorId": "<Author UUID>",
  "tagIds": ["<Tag UUID>", ..."<Tag UUID>"]
}
```
### `PATCH /posts/<UUID>`

Replaces the `contents` property of the post with the given UUID.

#### Request body

```json
{
  "contents": "Here's the updated content body of my post"
}
```
