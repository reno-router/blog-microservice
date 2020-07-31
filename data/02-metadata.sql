use blogs;

insert into author
values
  (UUID_TO_BIN(UUID()), 'James Wright'),
  (UUID_TO_BIN(UUID()), 'Joe Bloggs');

insert into tag
values
  (UUID_TO_BIN(UUID()), 'JavaScript'),
  (UUID_TO_BIN(UUID()), 'TypeScript'),
  (UUID_TO_BIN(UUID()), 'Deno'),
  (UUID_TO_BIN(UUID()), 'Rust'),
  (UUID_TO_BIN(UUID()), 'Go'),
  (UUID_TO_BIN(UUID()), 'C#');
