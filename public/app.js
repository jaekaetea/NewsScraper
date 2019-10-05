$(document).ready(function() {

getArticles();
$(document).on("click", "button#scrape", scrape);
$(document).on("click", "button#clear", clear);
$(document).on("click", "button.article", saveArticle)

function scrape() {
    $("#articles").empty();
    $.getJSON("/scrape", function(data) {
        console.log("Scraped.");
        getArticles();
    });
};

function clear() {
    $("#articles").empty();
    $.getJSON("/clear", function(data) {
        console.log("Cleared.");
    });
};

function getArticles() {
    $.getJSON("/articles").then(function(data) {
        for (var i = 0; i < data.length; i++) {
            $("#articles")
            .append("<div class='card'><div class='card-header'>" +
            "<button type='button' class='article btn btn-success' id=" + data[i]._id + "> Save Article </button>" +
            "<a href='" + data[i].link + "' target='_blank' id='newsLink'>" + data[i].title + 
            "</a></div>" +
            "<div class='card-body'>" + data[i].summary + "</div></div>");
        }
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