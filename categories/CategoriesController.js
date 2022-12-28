const express = require("express");
const slugify = require("slugify");
const router = express.Router();
const Category = require("./Category");
const adminAuth = require("../middlewares/adminAuth");

router.post("/categories/save", adminAuth, (req, res) => {
  var title = req.body.title;
  if (title != undefined) {
    Category.create({
      title: title,
      slug: slugify(title),
    }).then(() => {
      res.redirect("/admin/categories");
    });
  } else {
    res.redirect("/categories/save");
  }
});

router.get("/admin/categories/new", adminAuth, (req, res) => {
  res.render("admin/categories/new");
});
router.get("/admin/categories", adminAuth, (req, res) => {
  Category.findAll().then((category) => {
    res.render("admin/categories/index", {
      categories: category,
    });
  });
});
router.post("/categories/delete", adminAuth, (req, res) => {
  var id = req.body.id;
  Category.destroy({
    where: {
      id: id,
    },
  }).then(() => {
    res.redirect("/admin/categories");
  });
});

router.get("/admin/categories/update/:id", adminAuth, (req, res) => {
  var id = req.params.id;
  if (isNaN(id)) {
    res.redirect("/admin/categories");
  } else {
    Category.findOne({ where: { id: id } }).then((category) => {
      res.render("admin/categories/update", {
        category: category,
      });
    });
  }
});
router.post("/categories/updateinfo", adminAuth, (req, res) => {
  var id = req.body.id;
  var title = req.body.title;

  if (isNaN(id)) {
    res.redirect("/admin/categories/update");
  } else {
    Category.update(
      { title: title, slug: slugify(title) },
      { where: { id: id } }
    ).then(() => {
      res.redirect("/admin/categories");
    });
  }
});
module.exports = router;
