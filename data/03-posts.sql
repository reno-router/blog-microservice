use blogs;

select @james_id:=id
from author
where display_name = 'James Wright';

select @joe_id:=id
from author
where display_name = 'Joe Bloggs';

select @javascript_id:=id
from tag
where display_name = 'JavaScript';

select @typescript_id:=id
from tag
where display_name = 'TypeScript';

select @deno_id:=id
from tag
where display_name = 'Deno';

select @rust_id:=id
from tag
where display_name = 'Rust';

select @go_id:=id
from tag
where display_name = 'Go';

select @csharp_id:=id
from tag
where display_name = 'C#';

create temporary table post_metadata (meta JSON);

insert into post_metadata
values
  (CONCAT(
    '{"id": "',
      UUID(),
    '", "author_id": "',
      @james_id,
    '", "title": "Deno 1.2.1 released',
    '", "tag_ids": "[',
      '"', @javascript_id, '"',
      '"', @typescript_id, '"',
      '"', @deno_id, '"',
      '"', @rust_id, '"',
    ']"}')
  )

insert into post
values
  (UUID_TO_BIN(UUID()), @james_id, 'Deno 1.2.1 released', 'Blog contents here');
