const { Client } = require("pg");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); //Aktivera formulärdata

//Anslut till databasen
const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect((err) => {
    if (err) {
        console.log("Fel vid anslutning: " + err);
    } else {
        console.log("Ansluten till databasen");
    }
});

//Routing
app.get("/", async (req, res) => {
    res.render("index");
});

app.get("/courses", async (req, res) => {
    res.render("courses");
});

app.post("/courses", async (req, res) => {
    const coursecode = req.body.coursecode;
    const coursename = req.body.coursename;
    const syllabus = req.body.syllabus;
    const progression = req.body.progression;

    let error = "";

    await client.query("INSERT INTO courses (coursecode, coursename, syllabus, progression) VALUES($1, $2, $3, $4)", [coursecode, coursename, syllabus, progression]);
    res.redirect("/courses");
});

app.get("/about", (req, res) => {
    res.render("about");
});

//starta servern
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Servern startad på port: " + process.env.PORT);
});