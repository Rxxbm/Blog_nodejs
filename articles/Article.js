const Sequelize = require("sequelize");
const connection = require("../database/connection");
const Category = require("../categories/Category");

const Article = connection.define("articles", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
});

Category.hasMany(Article); // uma categoria pertence a muitos artigos
Article.belongsTo(Category); // 1 Artigo pertence a uma categoria

// Article.sync({ force: true });

module.exports = Article;
