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

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

//Cloudinary route
const fileUploader = require('../config/cloudinary.config');


// router.post("/signup", isLoggedOut, (req, res) => {

//   const { username, email, password } = req.body;
//   if (!username || !email || !password) {
//     res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
//     return;
//   }
  
//   if (!username) {
//     return res
//       .status(400)
//       .render("auth/signup", { errorMessage: "Please provide your username." });
//   }

//   if (password.length < 8) {
//     return res.status(400).render("auth/signup", {
//       errorMessage: "Your password needs to be at least 8 characters long.",
//     });
//   }

//   //   ! This use case is using a regular expression to control for special characters and min length
  
//   const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

//   if (!regex.test(password)) {
//     return res.status(400).render("auth/signup", {
//       errorMessage:
//         "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
//     });
//   }
  

//   // Search the database for a user with the username submitted in the form
//   User.findOne({ username }).then((found) => {
//     // If the user is found, send the message username is taken
//     if (found) {
//       return res
//         .status(400)
//         .render("auth/signup", { errorMessage: "Username already taken." });
//     }

//     // if user is not found, create a new user - start with hashing the password
//     return bcrypt
//       .genSalt(saltRounds)
//       .then((salt) => bcrypt.hash(password, salt))
//       .then((passwordHash) => {
//         // Create a user and save it in the database
//         return User.create({
//           username,
//           password: passwordHash,
//         });
//       })
//       .then((user) => {
//         // Bind the user to the session object
//         req.session.user = user;
//         res.redirect("/");
//       })
//       .catch((error) => {
//         if (error instanceof mongoose.Error.ValidationError) {
//           return res
//             .status(400)
//             .render("auth/signup", { errorMessage: error.message });
//         }
//         if (error.code === 11000) {
//           return res.status(400).render("auth/signup", {
//             errorMessage:
//               "Username need to be unique. The username you chose is already in use.",
//           });
//         }
//         return res
//           .status(500)
//           .render("auth/signup", { errorMessage: error.message });
//       });
//   });
// });

router.post('/signup', isLoggedOut, (req, res, next) => {
  const { username, email, password } = req.body;
 
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
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
      req.session.user = userFromDB;
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

bcryptjs
    .genSalt(saltRounds)
    .then(/* ... */)
    .then(/* ... */)
    .catch(/* ... */);
  // ...
});

router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});



router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

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
        req.session.user = user;
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

router.post("/create", fileUploader.single('profile-cover-image'), (req, res) => {
  const username = req.session.user.username;
  const { existingImage } = req.body;
 
  let imageUrl;
  if (req.file) {
    imageUrl = req.file.path;
  } else {
    imageUrl = existingImage;
  }
  User.findOneAndUpdate({username}, { profilePicture:imageUrl }, { new: true })
  console.log('updated user :>> ', profilePicture)
    .then((updatedUser) => {
      console.log('updated user :>> ', updatedUser)
      res.redirect(`/${username}`);
    })
    .catch(error => console.log(`Error while updating pic: ${error}`));
});


// router.get("/${username}", (req, res) => {
  router.get("/user-profile", (req, res) => {
    const { username } = req.params;

    User.findOne({username})
      .then(() => res.render('users/user-profile', { userInSession: req.session.user} ))
      .catch(error => console.log(`Error while editing: ${error}`));
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

router.get("/forgot-password", isLoggedOut, (req, res) => {
  res.render("auth/forgot-password");
});



module.exports = router;
