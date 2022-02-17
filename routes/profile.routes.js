const router = require("express").Router();
const User = require("../models/User.model");


router.get("/user-profile", (req, res, next) => {
  res.render("users/user-profile");
});



module.exports = router;
