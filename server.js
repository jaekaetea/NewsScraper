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

//Clears home articles
app.get("/clear", function(req, res) {
    db.Article.remove({ "saved": false })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

//Clears saved articles
app.get("/clear-saved", function(req, res) {
    db.Article.remove({ "saved": true })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.get("/scrape", function(req, res) {
    axios.get("https://www.nytimes.com/").then(function(response) {
        var $ = cheerio.load(response.data);

        $("article h2").each(function(i, element) {
            var result = {};

            result.title = $(element).text();
            var link = $(element).parent().parent().attr("href");
            result.link = "https://www.nytimes.com" + link;
            result.summary = $(element).parent().siblings().text();
            
            if (result.title && result.link && result.summary) {
                db.Article.create(result) 
                .then(function(dbArticle) {
                    res.json(dbArticle);
                })
                .catch(function(err) {
                    console.log(err);
                });
            }
        });
    });
});

//Gets articles for index
app.get("/articles/", function(req, res) {
    db.Article.find({ "saved": false })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

//Gets all saved articles
app.get("/articles/saved", function(req, res) {
    db.Article.find({ "saved": true })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

//Saves article
app.get("/article/:id", function(req, res) {
    db.Article.update({ _id: req.params.id  }, { $set: { "saved": true }})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

//Deletes saved article
app.get("/clear-article/:id", function(req, res) {
    db.Article.remove({ _id: req.params.id })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

//Retrives all reviews
app.get("/reviews/:id", function(req, res) {
    db.Article.find({ _id: req.params.id })
        .populate("reviews")
        .then(function(dbReviews) {
            res.json(dbReviews);
        })
        .catch(function(err) {
            res.json(err);
        });
});

//Adds a review
app.post("/review/:id", function(req, res) {
    db.Review.create(req.body) 
        .then(function(dbReview) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { reviews: dbReview._id }}, { new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            console.log(err);
        });
});

// //Deletes a review
// app.get("/clear-review/:id", function(req, res) {
//     db.Review.remove({ _id: req.params.id })
//         .then(function(dbArticle) {
//             res.json(dbArticle);
//         })
//         .catch(function(err) {
//             res.json(err);
//         });
// });

app.listen(PORT, function() {
    console.log("App running on port: " + PORT + "!");
});