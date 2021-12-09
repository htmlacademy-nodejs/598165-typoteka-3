"use strict";

const {DataTypes, Model} = require(`sequelize`);


const define = (sequelize) => {
  class Comment extends Model {}

  return Comment.init({
    text: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: `Comment`,
    tableName: `comments`
  });
};

module.exports = define;
