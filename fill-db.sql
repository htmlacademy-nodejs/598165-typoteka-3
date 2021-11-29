INSERT INTO users(email, password_hash, first_name, last_name, avatar)
VALUES ('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar1.jpg'),
       ('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar2.jpg');
INSERT INTO categories(name)
VALUES ('Деревья'),
       ('За жизнь'),
       ('Без рамки'),
       ('Разное'),
       ('IT'),
       ('Музыка'),
       ('Кино'),
       ('Программирование'),
       ('Железо');
ALTER TABLE articles
  DISABLE TRIGGER ALL;
INSERT INTO articles(title, announce, full_text, picture, author_id)
VALUES ('Ёлки. История деревьев', 'Золотое сечение — соотношение двух величин, гармоническая пропорция.',
        'Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.,Программировать не настолько сложно, как об этом говорят.,Первая большая ёлка была установлена только в 1938 году.,Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.,Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.,Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?,Золотое сечение — соотношение двух величин, гармоническая пропорция.,Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.,Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.,Ёлки — это не просто красивое дерево. Это прочная древесина.',
        'skyscraper@1x.jpg', 1),
       ('Учим HTML и CSS',
        'Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Из под его пера вышло 8 платиновых альбомов.',
        'Первая большая ёлка была установлена только в 1938 году.,Золотое сечение — соотношение двух величин, гармоническая пропорция.,Простые ежедневные упражнения помогут достичь успеха.,Ёлки — это не просто красивое дерево. Это прочная древесина.,Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.,Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.,Как начать действовать? Для начала просто соберитесь.,Это один из лучших рок-музыкантов.,Достичь успеха помогут ежедневные повторения.,Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.',
        'skyscraper@1x.jpg', 2),
       ('Борьба с прокрастинацией',
        'Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры. Он написал больше 30 хитов. Простые ежедневные упражнения помогут достичь успеха. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.',
        'Собрать камни бесконечности легко, если вы прирожденный герой.,Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравится только игры.,Программировать не настолько сложно, как об этом говорят.,Золотое сечение — соотношение двух величин, гармоническая пропорция.,Первая большая ёлка была установлена только в 1938 году.,Вы можете достичь всего. Стоит только немного постараться и запастись книгами.,Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.,Это один из лучших рок-музыкантов.,Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.',
        '', 2);
ALTER TABLE articles
  ENABLE TRIGGER ALL;
ALTER TABLE articles_categories
  DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id)
VALUES (1, 4),
       (2, 3),
       (3, 4);
ALTER TABLE articles_categories
  ENABLE TRIGGER ALL;
ALTER TABLE comments
  DISABLE TRIGGER ALL;
INSERT INTO comments(article_id, author_id, text)
VALUES (1, 2, ''),
       (1, 2, 'Хочу такую же футболку :-) Плюсую, но слишком много букв! '),
       (1, 2, ''),
       (2, 2,
        'Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Совсем немного...'),
       (3, 1, 'Плюсую, но слишком много букв!');
ALTER TABLE comments
  ENABLE TRIGGER ALL;