"use strict";

const defineModels = require(`../models`);
const Alias = require(`../models/alias`);
const {getRandomFromArray} = require(`../../utils`);

module.exports = async (sequelize, {categories, articles, users}) => {
  const {Category, Article, User} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(categories
    .map((item) => ({name: item})));
  const userModels = await User.bulkCreate(users);

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  const articlesPromises = articles.map((article) => async () => {
    const articleModel = await Article.create(article, {
      include: [Alias.COMMENTS]
    });
    const userModel = await User.findOne({
      where: {email: article.user.email},
    });
    await userModel.addArticle(articleModel);
    await articleModel.addCategories(article.categories
      .map((name) => categoryIdByName[name]));

    const commentModels = await articleModel.getComments();
    for (const commentModel of commentModels) {
      await articleModel.addComment(commentModel);
      await getRandomFromArray(userModels)
        .addComment(commentModel);
    }
  });

  for (const articlePromise of articlesPromises) {
    await articlePromise();
  }
};

