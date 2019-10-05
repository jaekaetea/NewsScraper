$(document).ready(function() {

getArticles();
$(document).on("click", "button#scrape", scrape);
$(document).on("click", "button.scrape", scrape);
$(document).on("click", "button#clear", clear);
$(document).on("click", "button.article", saveArticle)

function scrape() {
    $("#articles").empty();
    $("#articles").append(
        "<div class='alert alert-warning' id='empty-alert' role='alert'>" +
        "Scraping news articles in progress. . ." +
        "</div>");
    $.getJSON("/scrape").then(function(data) {
        getArticles();
    });
};

function clear() {
    $("#articles").empty();
    $.getJSON("/clear", function(data) {
        showEmpty();
    });
};

function showEmpty() {
    $("#articles").append(
        "<div class='alert alert-warning' id='empty-alert' role='alert'>" +
        "Uh Oh.  Looks like we don't have any new articles." +
        "</div>" + 
        "<div class='card'><div class='card-header'>" +
        "What Would You Like To Do?" +
        "</div>" +
        "<div class='card-body'>" + 
        "<button class='scrape btn btn-link'> Try Scraping New Articles </button><br><br>" +
        "<a href='/saved'> Go to Saved Articles </a>" +
        "</div></div>"
    );
};

function getArticles() {
    $.getJSON("/articles").then(function(data) {
        $("#articles").empty();
        for (var i = 0; i < data.length; i++) {
            $("#articles")
            .append("<div class='card'><div class='card-header'>" +
            "<button type='button' class='article btn btn-success' id=" + data[i]._id + "> Save Article </button>" +
            "<a href='" + data[i].link + "' target='_blank' id='newsLink'>" + data[i].title + 
            "</a></div>" +
            "<div class='card-body'>" + data[i].summary + "</div></div>");
        };
    }).then(function() {
        if ($("#articles").is(':empty')) {
            showEmpty();
        };
    });
};

function saveArticle() {
    var id = this.id;
    $(this).parents(".card").remove();
    $.getJSON("/article/" + id, function(data) {
        console.log("Done.");
    });
};

});