use blogs;

select id
into @james_id
from author
where display_name = 'James Wright';

select id
into @joe_id
from author
where display_name = 'Joe Bloggs';

select id
into @javascript_id
from tag
where display_name = 'JavaScript';

select id
into @typescript_id
from tag
where display_name = 'TypeScript';

select id
into @deno_id
from tag
where display_name = 'Deno';

select id
into @rust_id
from tag
where display_name = 'Rust';

select id
into @go_id
from tag
where display_name = 'Go';

select id
into @csharp_id
from tag
where display_name = 'C#';

create temporary table if not exists post_data (
  post JSON
);

insert into post_data
values
  (JSON_OBJECT(
    'id', UUID_TO_BIN(UUID()),
    'author_id', @james_id,
    'title', 'Deno 1.2.1 released',
    'contents', 'Blog content here!',
    'tag_ids', JSON_ARRAY(
      @javascript_id,
      @typescript_id,
      @deno_id,
      @rust_id
    )
  ));

delimiter $$
create procedure dowhile()
begin
  declare finished int default 0;
  declare pst JSON;

  declare post_cursor cursor for
  select post from post_data;

  declare continue handler for
  not found set finished = 1;

  open post_cursor;

  start transaction;

  do_insert: loop
  	fetch post_cursor into pst;

    if finished = 1 then
   	  leave do_insert;
   	end if;

    insert into post
    values
      (JSON_EXTRACT(pst, '$.id', '$.author_id', '$.title', '$.contents'));
  end loop;

  close post_cursor;

  commit;
end
$$

delimiter ;
