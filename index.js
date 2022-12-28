const express = require("express");
const app = express();
const connection = require("./database/connection");
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");
const usersController = require("./users/UsersController");
const session = require("express-session");
const adminAuth = require("./middlewares/adminAuth");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

connection
  .authenticate()
  .then(() => {
    console.log("Banco de dados conectado");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(
  session({
    secret: "qualquercoisa",
    cookie: { maxAge: 60000 * 300 },
  })
);
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);
app.get("/", (req, res) => {
  Article.findAll({ order: [["id", "DESC"]] }).then((article) => {
    Category.findAll().then((categories) => {
      res.render("index", {
        article: article,
        categories: categories,
      });
    });
  });
});

app.get("/category/:slug", (req, res) => {
  var slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Article }],
  })
    .then((categories) => {
      if (categories != undefined) {
        Category.findAll().then((category) => {
          res.render("category", {
            articles: categories.articles,
            category: category,
          });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
    });
});

app.get("/article/:id", (req, res) => {
  var id = req.params.id;
  Article.findByPk(id).then((article) => {
    res.render("article", {
      article: article,
    });
  });
});

app.listen(3000, () => {});
