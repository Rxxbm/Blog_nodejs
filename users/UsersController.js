const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});
router.get("/admin/users", adminAuth, (req, res) => {
  User.findAll().then((users) => {
    res.render("admin/users/index", {
      users: users,
    });
  });
});
router.get("/admin/users/login", (req, res) => {
  res.render("admin/users/login");
});

//posts

router.post("/users/delete", (req, res) => {
  var id = req.body.id;
  User.destroy({ where: { id: id } }).then(() => {
    res.redirect("/admin/users");
  });
});

router.post("/users/create", (req, res) => {
  var password = req.body.password;
  var email = req.body.email;

  User.findOne({ where: { email: email } }).then((users) => {
    if (users == undefined) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      User.create({
        email: email,
        password: hash,
      })
        .then(() => {
          res.redirect("/admin/users");
        })
        .catch((err) => {
          res.redirect("/admin/users");
        });
    } else {
      res.send("Email já existente");
    }
  });
});

router.post("/users/login", (req, res) => {
  var password = req.body.password;
  var email = req.body.email;

  User.findOne({ where: { email: email } }).then((user) => {
    if (user != undefined) {
      const check = bcrypt.compareSync(password, user.password);
      if (check) {
        req.session.user = {
          id: user.id,
          email: user.email,
        };
        res.redirect("/admin/articles");
      } else {
        res.redirect("/admin/users/login");
      }
    } else {
      res.send("acesso negado");
    }
  });
});

module.exports = router;
