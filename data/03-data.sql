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
    'id', UUID(),
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

drop procedure if exists insert_data;

delimiter $$
create procedure insert_data()
begin
  declare finished int default 0;
  declare pst JSON;

  declare post_cursor cursor for
  select post from post_data;

  declare continue handler for
  not found set finished = 1;

  open post_cursor;

  insert_posts: loop
    fetch post_cursor into pst;

    if finished = 1 then
   	  leave insert_posts;
   	end if;

    insert into post
    values
      (
        pst->>'$.id',
        pst->>'$.author_id',
        pst->>'$.title',
        pst->>'$.contents'
      );

    insert_tags: begin
      declare i int default 0;

      while i < JSON_LENGTH(pst->'$.tag_ids') do
        insert into post_tags
        values
          (UUID(), pst->>'$.id', JSON_UNQUOTE(JSON_EXTRACT(pst, CONCAT('$.tag_ids[', i, ']'))));

        set i = i + 1;
      end while;
    end insert_tags;
  end loop;

  close post_cursor;
end
$$

delimiter ;

call insert_data();
