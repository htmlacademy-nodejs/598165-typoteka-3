"use strict";

const {DataTypes, Model} = require(`sequelize`);

class User extends Model {
}

const define = (sequelize) => User.init({
  email: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(320),
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

module.exports = define;
