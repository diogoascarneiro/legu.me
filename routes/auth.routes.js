const router = require("express").Router();

// ℹ️ Handles password encryption
//const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

const bcryptjs = require('bcryptjs');

// Require models
const User = require("../models/User.model");
const Recipe = require("../models/Recipe.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const {isLoggedIn, isLoggedOut} = require("../middleware/auth.middleware");
const { collection } = require("../models/User.model");

//Cloudinary route
const fileUploader = require('../config/cloudinary.config');

// Bring in the cleaners
const {cleanRecipeListInfo} = require("../utils/recipe-data-cleaner");

/*function userUpdateQueryCreator (newData){
  let theQuery = {};
  if (newData.username != ""){
    theQuery.username = newData.username;
  }
  if (newData.name != ""){
    theQuery.username = newData.name;
  }
}*/

router.post('/users/:usermame/delete', (req, res, next) => {
  const { username } = req.session.currentUser;
  User.findOneAndRemove({ username })
  .then(data => { 
    if (!data) {
      res.status(404).send({
        message: `Cannot delete id=${username}. Maybe it was not found!`
        
      });
    } else {
      delete req.session.currentUser;
      res.redirect('/delete-confirmation');
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete id=" + username
    });
  })
});

router.get("/delete-confirmation", (req,res) =>{
  res.render("users/delete-conf");
  // res.render("users/delete-conf", setTimeout(()=> res.redirect ("/"), 2000));

});

router.get("/about", (req, res) => {
  res.render("./about");
});

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post('/signup', isLoggedOut, fileUploader.single('profile-cover-image'), (req, res, next) => {
  const { username, email, password, existingImage } = req.body;

  let profilePicture;
    if (req.file) {
      profilePicture = req.file.path;
    } else {
      profilePicture = existingImage;
    }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  if (!username || !email || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        username,
        email,
        passwordHash: hashedPassword,
        profilePicture
      });
    })
    .then(userFromDB => {
      req.session.currentUser = userFromDB;
      res.redirect(`/users/${username}`);
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render('auth/signup', { errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).render('auth/signup', {
           errorMessage: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
      }
    });

});

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login."
    });
    return;
  }

  if (!username) {
    return res
      .status(400)
      .render("auth/login", { errorMessage: "Please provide your username." });
  }

  if (password.length < 8) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }


  User.findOne({ username })
    .then((user) => {
 
      if (!user) {
        return res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
      }

      bcryptjs.compare(password, user.passwordHash).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("auth/login", { errorMessage: "Wrong credentials." });
        }
        req.session.currentUser = user;
        return res.redirect(`/users/${username}`);
      });
    })

    .catch((err) => {
      next(err);
    });
});


router.get("/forgot-password", isLoggedOut, (req, res) => {
  res.render("auth/forgot-password");
});

router.get('/logout', (req, res) => {
  if(req.session.currentUser) {
      delete req.session.currentUser;
      res.redirect('/login');
  } else {
      res.redirect('/');
  }        
});


  router.get("/users/:username",(req, res) => {
       User.findById(req.session.currentUser._id)
            .then((user) => {
              Recipe.find().where('_id').in(user.favouriteRecipes).exec((err, records) => {
                cleanRecipeListInfo(records);
                res.render('users/user-profile', { 
                  userInSession: req.session.currentUser,
                  favouriteRecipes: records
                })
              });
              })
            .catch(err => console.log(err)); 
      
});


router.post("/users/:username", isLoggedIn, fileUploader.single('profile-cover-image'), (req, res) => {
  const { username } = req.session.currentUser;
  const { existingImage } = req.body;
  let imageUrl;
  if (req.file) {
    imageUrl = req.file.path;
    User.findOneAndUpdate({username}, { profilePicture:imageUrl }, { new: true })
    .then(() =>  {   
      req.session.currentUser.profilePicture = imageUrl;
      res.render('users/user-profile', { userInSession: req.session.currentUser} )
    } )
    .catch(error => console.log(`Error while updating pic: ${error}`));
  }
  

  // router.get("/recipes/:label", (req, res, next) => {
  //   const { label } = req.params;
  //   let isFavourite;
  
  //   if ("currentUser._id" in req.session) {
  //    Recipe.findOne({ label: label })
  //     .then((theRecipe) => {
  //       User.findById(req.session.currentUser._id)
  //       .then((user) => {
  //         if (user.favouriteRecipes.indexOf(theRecipe._id) === -1) {
  //           isFavourite = false;
  //         } else {isFavourite = true}
  //       })
  //       .then(() => {
  //         cleanRecipeObjInfo(theRecipe);
  //         // Get four random recipes of the same type for the "related recipes" bit
  //         Recipe.findRandom({ dishType: theRecipe.dishType }, {}, { limit: 4 }, function (err, randomResults) {
  //           if (!err) {
  //             cleanRecipeListInfo(randomResults);
  //             res.render("recipeSingle", {
  //               recipe: theRecipe,
  //               randomRecipes: randomResults,
  //               isFavourite
  //             });
  //           }
  //         });
  //       })
  //     })

  
});



// router.post("/profile", (req, res) => {
//   const { username } = req.params.currentUser;

//   User.findByIdAndUpdate(username, {currentUser:username})
//   .then(successCallback)
//   .catch(errorCallback);
// });


module.exports = router;