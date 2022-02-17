const router = require("express").Router();


router.get("/about", (req, res, next) => {
  res.render("/about");
});

  
// router.post("/", (req, res, next) => {
//     res.render("index");
//   });

module.exports = router;