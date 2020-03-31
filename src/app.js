const path = require("path");
const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
// const db = require("./utils/db");
// const optionQuery = require("./utils/db");
const config = require("./utils/config");
const mysql = require("mysql");

const app = express();
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");
const templatesPath = path.join(__dirname, "../templates");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Database connection
const db = mysql.createConnection(config.config);
console.log(config.config);
db.connect(err => {
  if (err) throw err;
  console.log("Connected to Triangle database successfuly");
});

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
  q = "SELECT libCourse FROM triangle.courseTitle;";
  db.query(q, (err, results, field) => {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      opts.push(results[i].libCourse);
    }
    res.render("subscription", { optData: opts });
  });
});

app.get("/insert", (req, res) => {
  var name = "The wolf";
  var surname = "The Surname";
  //   q = `CALL insertUser("The name, "The surname, "The mail", "The phone", "The course")`;
  q = `CALL simpleInsert("${name}")`;
  db.query(q, true, (err, field, results) => {
    if (err) throw err;
    console.log("data inserted");
  });
});

app.post("/sendsubform", urlEncodedParser, (req, res) => {
  console.log(req.body);
  // const { nameUser, surnameUser, mailUser, phoneUser, courseUser } = req.body;
  let nameUser = req.body.nuser;
  let surnameUser = req.body.puser;
  let mailUser = req.body.mailuser;
  let phoneUser = req.body.teluser;
  let courseUser = req.body.course;

  console.log(req.body);
  q = `CALL insertUser("${nameUser}", "${surnameUser}", "${mailUser}", "${phoneUser}", "${courseUser}")`;
  console.log(q);
  db.query(q, true, (err, field, results) => {
    if (err) throw err;
    console.log("user inserted succesfully");
  });
  res.end();
});

//loading users data
app.get("/load", (req, res) => {
  q = `SELECT * FROM user`;
  db.query(q, (err, field, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    name: "Ouattara",
    title: "404",
    errorMessage: "Page not found"
  });
});
app.listen(port);
