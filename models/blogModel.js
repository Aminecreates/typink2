const mongoose = require("mongoose");
const slugify = require("slugify");
const cheerio = require("cheerio");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A blog must have a title"],
    unique: true,
    maxLength: ["40", "A blog must have less than 40 characters"],
    minLength: ["5", "A blog must have more than 5 characters"],
  },
  slug: String,
  topic: {
    type: String,
    required: [true, "A blog must have a genre"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  summary: {
    type: String,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: [true, "A blog must have an author"],
  },
  content: {
    type: String,
    required: [true, "A blog must have content"],
  },
  imageCover: {
    type: String,
    default: "default.jpg",
  }, // Add the imageCover property
  bookmarkedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  tags: {
    type: [String],
    default: [],
  },
  minutesRead: {
    type: Number,
    // required: [true, "A blog must have minutesRead"],
    min: [2, "A blog must have more than 2 minutes of reading"],
    max: [60, "A blog must have less than 60 minutes of reading"],
  },
  secretBlog: {
    type: Boolean,
    default: false,
  },
});

// Middleware to automatically generate summary

// Middleware to automatically generate summary
blogSchema.pre("save", function (next) {
  // Parse the HTML content using Cheerio
  const $ = cheerio.load(this.content);

  // Extract the text from the first paragraph
  const firstParagraphText = $("p").first().text();

  // Limit the summary to less than 100 characters and append three dots
  this.summary = firstParagraphText.substring(0, 200).trim() + "...";

  next();
});

// Middleware to exclude secret blogs from query results
blogSchema.pre(/^find/, function (next) {
  this.find({ secretBlog: { $ne: true } });
  next();
});

// Middleware to create slug from title
blogSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
