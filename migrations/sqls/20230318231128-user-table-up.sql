CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(64),
  firstName VARCHAR(32),
  lastName VARCHAR(32),
  password VARCHAR
)