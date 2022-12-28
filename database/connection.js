const Sequelize = require("sequelize");

const connection = new Sequelize("guiapress", "root", "", {
  hostname: "localhost",
  dialect: "mysql",
  logging: false,
  timezone: "-03:00",
});

module.exports = connection;
