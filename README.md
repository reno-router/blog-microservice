# Blog Microservice

I will be adding unit tests, CICD, and extending this README over the next week (as of 8th August), but to run the service:

1. [install Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) if you haven't already

2. `$ docker-compose up`

You can then invoke one of the below HTTP requests.

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
