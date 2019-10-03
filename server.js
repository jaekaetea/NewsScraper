var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = 3000;
var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//Routes
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/saved", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/review.html"));
});


// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
    // mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

app.get("/clear", function(req, res) {
    db.Article.remove({"saved": false})
        .then(function(dbArticle) {
            scrape();
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

function scrape() {
    axios.get("https://www.nytimes.com/").then(function(response) {
        var $ = cheerio.load(response.data);

        $("article h2").each(function(i, element) {
            var result = {};

            result.title = $(element).text();
            var link = $(element).parent().parent().attr("href");
            result.link = "https://www.nytimes.com" + link;
            result.summary = $(element).parent().siblings().text();
            
            db.Article.create(result) 
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err);
                });
        });
    });
};

app.get("/articles", function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.listen(PORT, function() {
    console.log("App running on port: " + PORT + "!");
});