var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");
var PORT = 3000;
var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//Routes go here. https://www.nytimes.com/
app.get("/scrape", function(req, res) {
    axios.get("https://www.nytimes.com/").then(function(response) {
        var $ = cheerio.load(response.data);

        $("article h2").each(function(i, element) {
            var result = [];
            var title = $(this)
                .closest()
                .children("span")
                .text();

            var link = $(this)
                .parent("a")
                .attr("href");

            var summary = $(this)
                .next("p")
                .text();

            result.push({
                title: title,
                link: link,
                summary: summary
            });
        });
        console.log(result);
    });
});


app.listen(PORT, function() {
    console.log("App running on port: " + PORT + "!");
});