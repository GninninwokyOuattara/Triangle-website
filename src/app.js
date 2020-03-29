const path = require("path");
const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
// const db = require("./utils/db");
// const optionQuery = require("./utils/db");
const db = require("./utils/db");

// const mysql = require("mysql");

const app = express();
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
const templatesPath = path.join(__dirname, "../templates");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// query = "SELECT * FROM triangle.coach;";
// db.db.query(query, (err, result, field) => {
//   if (err) throw err;
//   console.log(result);
// });

// query = "SELECT libcourse FROM triangle.course;";
// db.db.query(query, (err, result, field) => {
//   if (err) throw err;
//   data = result;
// });

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);
// app.set("templates", templatesPath);
// app.set("partials", partialsPath);
app.use(express.static(publicDirectoryPath));

//landing page
app.get("/", (req, res) => {
  res.render("index");
});

//contact page
app.get("/contact", (req, res) => {
  res.render("contact");
});
//sub page
app.get("/subscription", (req, res) => {
  var opts = [];
  q = "SELECT libcourse FROM triangle.course;";
  db.db.query(q, (err, results, field) => {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      opts.push(results[i].libcourse);
    }
    res.render("subscription", { optData: opts });
  });
});

app.post("/sendsubform", urlEncodedParser, (req, res) => {
  console.log(req.body);
  res.end();
});

app.get("*", (req, res) => {
  res.render("404", {
    name: "Ouattara",
    title: "404",
    errorMessage: "Page not found"
  });
});
app.listen(port);
