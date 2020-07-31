use blogs;

insert into author
values
  (UUID(), 'James Wright'),
  (UUID(), 'Joe Bloggs');

insert into tag
values
  (UUID(), 'JavaScript'),
  (UUID(), 'TypeScript'),
  (UUID(), 'Deno'),
  (UUID(), 'Rust'),
  (UUID(), 'Go'),
  (UUID(), 'C#');
