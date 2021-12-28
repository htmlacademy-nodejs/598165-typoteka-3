"use strict";

const {DataTypes, Model} = require(`sequelize`);


const define = (sequelize) => {
  class User extends Model {}

  return User.init({
    email: {
      type: DataTypes[`STRING`](320),
      allowNull: false
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: `User`,
    tableName: `users`
  });
};

module.exports = define;
