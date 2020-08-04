set schema 'blogs';

create extension if not exists "uuid-ossp"
with version "1.1";

insert into author
values
  (uuid_generate_v4(), 'James Wright'),
  (uuid_generate_v4(), 'Joe Bloggs');

insert into tag
values
  (uuid_generate_v4(), 'JavaScript'),
  (uuid_generate_v4(), 'TypeScript'),
  (uuid_generate_v4(), 'Deno'),
  (uuid_generate_v4(), 'Rust'),
  (uuid_generate_v4(), 'Go'),
  (uuid_generate_v4(), 'C#');
