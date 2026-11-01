const express = require("express");
const mongoose = require("mongoose");

const Article = require("./models/Article");

const app = express();

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://MohammadAli:2UiqxW2mkfk5kNDU@cluster0.lifg2vk.mongodb.net/",
  )
  .then(() => {
    console.log("connected with DB successfully");
  })
  .catch((error) => {
    console.log("error with connecting with DB");
  });

app.get("/", (req, res) => {
  res.send("Hello in nodejs project");
});

app.get("/helloFromHtml", (req, res) => {
  res.sendFile(__dirname + "/views/numbers.html");
});

//to send js (variables) to html file, we use ejs
app.get("/helloFromEjs", (req, res) => {
  res.render("numbers.ejs", {
    name: "Mohammad",
  });
});

app.post("/numbers/:num1/:num2", () => {
  const num1 = req.params.num1;
  const num2 = req.params.num2;

  const total = num1 + num2;

  res.send(`the total number is ${total}`);
});

app.post("/articles", async (req, res) => {
  const newArticle = new Article();

  const artTitle = req.body.articleTitle;
  const artBody = req.body.articleBody;

  newArticle.title = artTitle;
  newArticle.body = artBody;
  newArticle.numbserOfLikes = 100;

  await newArticle.save();

  res.send(`
    the new article has been stored: \n
    ${newArticle}
    `);
});

app.get("/showArticles", async (req, res) => {
  const articles = await Article.find();

  res.json(articles);
});

app.get("/showArticlesEjs", async (req, res) => {
  const articles = await Article.find();

  res.render("articles.ejs", { allArticles: articles });
});

app.get("/showArticles/:articleId", async (req, res) => {
  const id = req.params.articleId;

  try {
    const article = await Article.findById(id);
    res.json(article);
  } catch (err) {
    console.log("error while reading articleId", id);
    return res.send("error");
  }
});

app.delete("/articles/:articleId", async (req, res) => {
  const id = req.params.articleId;

  try {
    const article = await Article.findByIdAndDelete(id);
    res.json(article);
  } catch (err) {
    console.log("error while reading articleId", id);
    return res.send("error");
  }
});

// const start = async () => {
//   try {
//     await mongoose.connect("mongodb://localhost/tarmeez");
//     console.log("Database connected");
//   } catch (err) {
//     console.error("Database connection failed:", err);
//     throw err;
//   }

// };
app.listen(3000, async () => {
  console.log("server is running at port 3000");
});

// start();
