const express = require("express");
const slugify = require("slugify");
const router = express.Router();
const Category = require("../categories/Category");
const adminAuth = require("../middlewares/adminAuth");
const Article = require("./Article");

router.get("/admin/articles", adminAuth, (req, res) => {
  Article.findAll({ include: [{ model: Category }] }).then((articles) => {
    res.render("admin/articles/index", {
      articles: articles,
    });
  });
});

router.get("/admin/articles/new", adminAuth, (req, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/articles/new", {
      categories: categories,
    });
  });
});

router.get("/admin/articles/update/:id", adminAuth, (req, res) => {
  var id = req.params.id;
  Article.findByPk(id).then((article) => {
    Category.findAll().then((categories) => {
      res.render("admin/articles/update", {
        article: article,
        categories: categories,
      });
    });
  });
});

router.post("/articles/save", adminAuth, (req, res) => {
  var body = req.body.body;
  var title = req.body.title;
  var category = req.body.category;
  if (title != undefined && body != undefined) {
    Article.create({
      title: title,
      body: body,
      slug: slugify(title),
      categoryId: category,
    }).then(() => {
      res.redirect("/admin/articles");
    });
  } else {
    res.redirect("/admin/articles");
  }
});

router.post("/articles/updateinfo", adminAuth, (req, res) => {
  var id = req.body.id;
  var body = req.body.body;
  var title = req.body.title;
  var category = req.body.category;

  if (isNaN(id)) {
    res.redirect("/admin/articles/update");
  } else {
    if (id != undefined && body != undefined && title != undefined) {
      Article.update(
        {
          title: title,
          slug: slugify(title),
          body: body,
          categoryId: category,
        },
        { where: { id: id } }
      ).then(() => {
        res.redirect("/admin/articles");
      });
    }
  }
});

router.post("/articles/delete", adminAuth, (req, res) => {
  var id = req.body.id;
  Article.destroy({
    where: {
      id: id,
    },
  }).then(() => {
    res.redirect("/admin/articles");
  });
});

module.exports = router;
