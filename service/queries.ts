const withUuid = (query: string) => `
  create extension if not exists "uuid-ossp"
  with version "1.1";

  ${query}
`;

const buildSelectPostQuery = (where = "", ...additionalFields: string[]) =>
  `
  select
    p.id,
    p.title,
    ${[...additionalFields, ""].join(", ")}
    json_build_object('id', a.id, 'name', a.display_name) as author,
    json_agg(json_build_object('id', t.id, 'name', t.display_name)) as tags

  from blogs.post p
  join blogs.author a
  on p.author_id = a.id
  join blogs.post_tags pt
  on p.id = pt.post_id
  join blogs.tag t
  on t.id = pt.tag_id
  ${where}
  group by p.id, a.id;
`;

export const GET_POSTS_QUERY = buildSelectPostQuery();

export const GET_POST_QUERY = buildSelectPostQuery(
  "where p.id = $1",
  "p.contents",
);

export const ADD_POST_QUERY = [
  `
    insert into blogs.post
    values
      ($1, $2, $3, $4);
  `,
  `

  insert into blogs.post_tags
  select tag_id from unnest(array['0e787ec8-5cd6-49fd-8367-aceef6090ea2'::uuid, '64057e1c-1a0a-4658-b3bc-d91678686627'::uuid]) as tag_id
  cross join
  select v
  from (values 'ce59e9d8-cc4c-4508-ab07-77ce06e74322'::uuid, 'ce59e9d8-cc4c-4508-ab07-77ce06e743e9'::uuid]) as m(v)
  `,
];
