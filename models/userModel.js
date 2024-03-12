const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profession: String, // Add profession field
  description: {
    type: String,
    validate: {
      validator: function (value) {
        const words = value.split(/\s+/).length;
        return words <= 150;
      },
      message: "Description should be less than or equal to 150 words",
    },
  }, // Add description field
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog", // Reference to the Blog model
    },
  ],
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm a password"],
    minlength: 8,
    validate: {
      // This only works on create and save
      validator: function (el) {
        return el === this.password; // If passwordconfirm = abc and password = abc => true
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre("save", async function (next) {
  // Run this function if password was actually modified
  if (!this.isModified("password")) return next();
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordconfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  const isCorrect = await bcrypt.compare(candidatePassword, userPassword);
  return isCorrect;
};

// Check if user changed password
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );

    console.log(this.passwordChangedAt);
    console.log(changedTimestamp);
    console.log(JWTTimeStamp);
    console.log(JWTTimeStamp < changedTimestamp);
    return JWTTimeStamp < changedTimestamp;
  }
};

userSchema.methods.createPasswordResetToken = function () {
  // Create a reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // save it encrypted to the DB
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() * 10 * 60 * 1000;

  console.log(this.passwordResetToken);

  // Return the unEncrypted token
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
