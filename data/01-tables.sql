use blogs;

create table if not exists post (
  id varchar(36) primary key not null,
  author_id varchar(36) not null,
  title text not null,
  contents text not null
);

create table if not exists author (
  id varchar(36) primary key not null,
  display_name text not null
);

create table if not exists tag (
  id varchar(36) primary key not null,
  display_name text not null
);

create table if not exists post_tags (
  id varchar(36) primary key not null,
  post_id varchar(36) references category(id),
  tag_id varchar(36) references question(id)
);
