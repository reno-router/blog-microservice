use blogs;

create table if not exists post (
  id binary(16) primary key not null,
  author_id binary(16),
  contents text not null
);

create table if not exists author (
  id binary(16) primary key not null,
  contents text not null
);

create table if not exists tag (
  id binary(16) primary key not null,
  display_name text not null
);

create table if not exists post_tags (
  id binary(16) primary key not null,
  post_id binary(16) references category(id),
  tag_id binary(16) references question(id)
);
