const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required']
    },
    favouriteRecipes:{type: Schema.Types.ObjectId, ref: "Recipe"}
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;