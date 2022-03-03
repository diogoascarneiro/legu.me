const router = require("express").Router();

// ℹ️ Handles password encryption
//const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

const bcryptjs = require('bcryptjs');

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const {isLoggedIn, isLoggedOut} = require("../middleware/auth.middleware");
const { collection } = require("../models/User.model");

//Cloudinary route
const fileUploader = require('../config/cloudinary.config');

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
      res.redirect(`/${username}`);
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

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
 
      if (!user) {
        return res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcryptjs.compare(password, user.passwordHash).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("auth/login", { errorMessage: "Wrong credentials." });
        }
        req.session.currentUser = user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect(`/${username}`);
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
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


  router.get("/:username",(req, res) => {
    const { username } = req.params;

    User.findOne({username})
      .then(() => res.render('users/user-profile', { userInSession: req.session.currentUser} ))
      .catch(error => console.log(`Error while editing: ${error}`));
});

router.post("/profile", isLoggedIn, fileUploader.single('profile-cover-image'), (req, res) => {
  const { username } = req.session.currentUser;
  const { existingImage } = req.body;
  // const { name } = req.body;

  let imageUrl;
  if (req.file) {
    imageUrl = req.file.path;
  } else {
    imageUrl = existingImage;
  }
  User.findOneAndUpdate({username}, { profilePicture:imageUrl }, { new: true })
  
    .then(() => res.render('users/user-profile', { userInSession: req.session.currentUser} ))
    .catch(error => console.log(`Error while updating pic: ${error}`));
});

router.delete('/profile/:username', (req, res) => {
  const userRemove = req.params.username;

  User.findOneAndRemove({ username }
  .then(data => {
    if (!data) {
      res.status(404).send({
        message: `Cannot delete id=${userRemove}. Maybe it was not found!`
      });
    } else {
      res.send({
        message: "Deleted successfully!"
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete id=" + userRemove
    });
  }));
});

router.post("/addname", (req, res) => {
  const { idUpdate } = req.params.id;

  User.findByIdAndUpdate(idUpdate, {name:name})
  .then(successCallback)
  .catch(errorCallback);
});



module.exports = router;