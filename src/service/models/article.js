"use strict";

const {DataTypes, Model} = require(`sequelize`);


const define = (sequelize) => {
  class Article extends Model {}

  return Article.init({
    title: {
      type: DataTypes[`STRING`](),
      allowNull: false
    },
    announce: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullText: {
      type: DataTypes[`STRING`](1000),
    },
    picture: DataTypes.STRING,
  }, {
    sequelize,
    modelName: `Article`,
    tableName: `articles`
  });
};

module.exports = define;
