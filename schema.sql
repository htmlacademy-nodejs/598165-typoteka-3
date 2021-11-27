CREATE TABLE categories
(
  id   integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(255) NOT NULL
);

CREATE TABLE users
(
  id            integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email         varchar(320) UNIQUE NOT NULL,
  password_hash varchar(255)        NOT NULL,
  first_name    varchar(255)        NOT NULL,
  last_name     varchar(255)        NOT NULL,
  avatar        varchar(255)
);

CREATE TABLE articles
(
  id         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title      varchar(255) NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  announce   text         NOT NULL,
  full_text  text,
  picture    varchar(255),
  author_id  integer      NOT NULL,
  FOREIGN KEY (author_id) REFERENCES users (id)
);

CREATE TABLE comments
(
  id         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  article_id integer NOT NULL,
  author_id  integer NOT NULL,
  text       text    NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  FOREIGN KEY (article_id) REFERENCES articles (id),
  FOREIGN KEY (author_id) REFERENCES users (id)
);

CREATE TABLE articles_categories
(
  article_id  integer NOT NULL,
  category_id integer NOT NULL,
  PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles (id),
  FOREIGN KEY (category_id) REFERENCES categories (id)
);

CREATE INDEX ON articles (title);
