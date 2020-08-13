create schema if not exists blogs;
set schema 'blogs';

create table if not exists author (
  id uuid primary key not null,
  display_name text not null
);

create table if not exists post (
  id uuid primary key not null,
  author_id uuid not null references author(id),
  title text not null,
  contents text not null
);

create table if not exists tag (
  id uuid primary key not null,
  display_name text not null
);

create table if not exists post_tags (
  id uuid primary key not null,
  post_id uuid references post(id),
  tag_id uuid references tag(id)
);
