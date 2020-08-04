set schema 'blogs';

create extension if not exists "uuid-ossp"
with version "1.1";

do $$
declare
  james_id uuid := (select id
    from author
    where display_name = 'James Wright');

  joe_id uuid := (select id
    from author
    where display_name = 'Joe Bloggs');

  javascript_id uuid := (select id
    from tag
    where display_name = 'JavaScript');

  typescript_id uuid := (select id
    from tag
    where display_name = 'TypeScript');

  deno_id uuid := (select id
    from tag
    where display_name = 'Deno');

  rust_id uuid := (select id
    from tag
    where display_name = 'Rust');

  go_id uuid := (select id
    from tag
    where display_name = 'Go');

  csharp_id uuid := (select id
    from tag
    where display_name = 'C#');

  pst record;
  tag_id uuid;
begin
  create temporary table posts_data (
    id uuid not null,
    author_id uuid not null,
    title text not null,
    contents text not null,
    tag_ids uuid[] not null
  );

  insert into posts_data
  values
    (
      uuid_generate_v4(),
      james_id,
      'Deno 1.2.1 released',
      'Blog content here!',
      array[
        javascript_id,
        typescript_id,
        deno_id,
        rust_id
      ]
    );

  for pst in select * from posts_data
  loop
    insert into post
    values
      (pst.id, pst.author_id, pst.title, pst.contents);

    foreach tag_id in array pst.tag_ids
    loop
      insert into post_tags
      values
        (uuid_generate_v4(), pst.id, tag_id);
    end loop;
  end loop;
end $$;
