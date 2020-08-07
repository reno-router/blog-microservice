const withUuid = (query: string) =>
  `
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

export const CREATE_POST_QUERY = [
  `
    insert into blogs.post
    values
      ($1, $2, $3, $4);
  `,
  `
  insert into blogs.post_tags
    (id, tag_id, post_id)
  select * from
    unnest(
   	  $1::uuid[],
   	  $2::uuid[]
    ) x (id, tag_id)
  cross join
    (select * from (values ($3::uuid)) post_id) y(post_id);
  `,
];

export const EDIT_POST_QUERY = `
  update blogs.post
  set contents = $2
  where id = $1::uuid;
`;
