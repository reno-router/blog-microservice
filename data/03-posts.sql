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
      '16f9d2b0-baf9-4618-a230-d9b95ab75fa8',
      james_id,
      'Deno 1.3.0 released',
      'This release includes new flags to various Deno commands and implements the W3C FileReader API, amongst other enhancements and fixes.',
      array[
        javascript_id,
        typescript_id,
        deno_id,
        rust_id
      ]
    ),
    (
      '006a8213-8aac-47e2-b728-b0e2c07ddaf6',
      joe_id,
      'Go''s generics experimentation tool',
      'To help decide how to further refine the recent Go generics design draft, the Go team is releasing a translation tool, which will permit devs to type check and run code written using the version of generics described in said draft.',
      array[
        go_id
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
