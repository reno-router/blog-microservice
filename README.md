# Blog Microservice

[![CI](https://github.com/reno-router/blog-microservice/workflows/CI/badge.svg?branch=master)](https://github.com/reno-router/blog-microservice/actions?query=workflow%3ACI)

An example Reno microservice for creating and fetching blog posts from a PostgreSQL database.

## Running Locally




1. [install Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) if you haven't already

2. `$ docker-compose up`

You can then invoke one of the following HTTP requests, or run the unit tests with `deno test`.

## Operations

### `GET /posts`

Retrieves metadata for all the posts in the database.

### `GET /posts/<UUID>`

Retrieves the metadata and content of the post for the given UUID.

### `POST /posts`

Adds a new post to the database.

#### Request body

```json
{
  "title": "My new post",
  "contents": "Here's the content body of my post",
  "authorId": "<UUID of the author>",
  "tagIds": ["<Tag UUID>", ..."<Tag UUID>"]
}
```
### `PATCH /posts/<UUID>`

Replaces the `contents` property of the post for the given UUID.

#### Request body

```json
{
  "contents": "Here's the updated content body of my post"
}
```
