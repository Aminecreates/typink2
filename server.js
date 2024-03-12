const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });
console.log(process.env.NODE_ENV);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// Open the connection outside of the request handler
let db;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((conn) => {
    console.log("DB Connection Successful ✨");
    db = conn;
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

const port = process.env.PORT || 3000;

app.get("/items/:my_item", async (req, res) => {
  // Check the connection status before using it
  if (db && db.readyState === 1) {
    let my_item = req.params.my_item;
    let item = await db
      .db("my_db")
      .collection("my_collection")
      .findOne({ name: my_item });
    res.json(item);
  } else {
    res.status(500).send("Database connection error");
  }
});

app.listen(port, () => {
  console.log(`app running on ${port} `);
});
