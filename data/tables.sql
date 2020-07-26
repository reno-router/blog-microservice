create schema if not exists blog;
set schema 'blog';

create table if not exists post (
  id uuid primary key not null,
  author_id uuid
  contents text not null,
);

create table if not exists author (
  id uuid primary key not null,
  contents text not null
);

create table if not exists tag (
  id uuid primary key not null,
  display_name text not null
);

create table if not exists post_tags (
  id uuid primary key not null,
  post_id uuid references category(id),
  tag_id uuid references question(id)
);
