-- Получить список всех категорий (идентификатор, наименование категории)
SELECT id, name
FROM categories;

-- Получить список категорий для которых создана минимум одна публикация
-- (идентификатор, наименование категории)

SELECT c.id, c.name
FROM categories c
       JOIN articles_categories ac on c.id = ac.category_id
GROUP BY c.id;

--   Получить список категорий с количеством публикаций
--   (идентификатор, наименование категории, количество публикаций в категории);

SELECT c.id, c.name, COUNT(ac.article_id) AS numbers_of_articles
FROM categories c
       JOIN articles_categories ac on c.id = ac.category_id
GROUP BY c.id;

-- Получить список публикаций
-- (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации,
-- имя и фамилия автора, контактный email, количество комментариев, наименование категорий).
-- Сначала свежие публикации;

SELECT a.id,
       a.title,
       a.announce,
       a.created_at,
       CONCAT(u.first_name, ' ', u.last_name) AS author_name,
       u.email,
       COUNT(com.id)                          AS comments_number,
       STRING_AGG(DISTINCT c.name, ', ')      AS categories_list
FROM articles a
       JOIN articles_categories ac on a.id = ac.article_id
       JOIN categories c on ac.category_id = c.id
       JOIN users u on a.author_id = u.id
       LEFT JOIN comments com on a.id = com.article_id
GROUP BY a.id, u.id
ORDER BY a.created_at DESC;

-- Получить полную информацию определённой публикации
-- (идентификатор публикации, заголовок публикации, анонс, полный текст публикации,
-- дата публикации, путь к изображению, имя и фамилия автора, контактный email,
-- количество комментариев, наименование категорий);

SELECT a.id,
       a.title,
       a.announce,
       a.created_at,
       CONCAT(u.first_name, ' ', u.last_name) AS author_name,
       u.email,
       COUNT(com.id)                          AS comments_number,
       STRING_AGG(DISTINCT c.name, ', ')      AS categories_list
FROM articles a
       JOIN articles_categories ac on a.id = ac.article_id
       JOIN categories c on ac.category_id = c.id
       JOIN users u on a.author_id = u.id
       LEFT JOIN comments com on a.id = com.article_id
WHERE a.id = 1
GROUP BY a.id, u.id;

-- Получить список из 5 свежих комментариев
-- (идентификатор комментария, идентификатор публикации, имя и фамилия автора,
-- текст комментария)

SELECT c.id,
       c.article_id,
       CONCAT(u.first_name, ' ', u.last_name) AS author_name,
       c.text,
FROM comments c
       JOIN users u on u.id = c.author_id
ORDER BY c.created_at DESC
LIMIT 5;

-- Получить список комментариев для определённой публикации
-- (идентификатор комментария, идентификатор публикации,
-- имя и фамилия автора, текст комментария).
-- Сначала новые комментарии

SELECT c.id,
       c.article_id,
       CONCAT(u.first_name, ' ', u.last_name) AS author_name,
       c.text
FROM comments c
       JOIN users u on u.id = c.author_id
WHERE c.article_id = 3
ORDER BY c.created_at DESC;

-- Обновить заголовок определённой публикации на «Как я встретил Новый год»

UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 1;
