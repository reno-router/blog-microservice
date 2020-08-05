const buildPostSelectQuery = (where = "", ...additionalFields: string[]) =>
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

export const GET_POSTS_QUERY = buildPostSelectQuery();

export const GET_POST_QUERY = buildPostSelectQuery(
  "where p.id = $1",
  "p.contents",
);
