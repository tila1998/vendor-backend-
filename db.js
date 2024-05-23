const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('vendor_profile', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

const TeamMember = sequelize.define('TeamMember', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  license: {
    type: DataTypes.STRING,
    allowNull: false
  },
  service: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Unable to sync the database:', err));

module.exports = {
  sequelize,
  TeamMember
};
