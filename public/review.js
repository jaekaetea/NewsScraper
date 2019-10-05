$(document).ready(function() {

getArticles();
$(document).on("click", "button#clear", clear);
$(document).on("click", "button.article", deleteArticle);
$(document).on("click", "button.notes", openModal);
$(document).on("click", "button.review", addReview);
$(document).on("click", "button.delete", deleteReview);

function clear() {
    $("#articles").empty();
    $.getJSON("/clear-saved", function(data) {
        showEmpty();
    });
};

function showEmpty() {
    $("#articles").append(
        "<div class='alert alert-warning' id='empty-alert' role='alert'>" +
        "Uh Oh.  Looks like we don't have any saved articles." +
        "</div>" + 
        "<div class='card'><div class='card-header'>" +
        "Would You Like to Browse Available Articles?" +
        "</div>" +
        "<div class='card-body'>" + 
        "<a href='/'> Browse Articles </a>" +
        "</div></div>"
    );
};

function getArticles() {
    $("#articles").empty();
    $.getJSON("/articles/saved", function(data) {
        for (var i = 0; i < data.length; i++) {
            $("#articles")
            .append("<div class='card'><div class='card-header'>" + 
            "<button type='button' class='notes btn btn-success' data-toggle='modal' data-target='#Modal' id=" + data[i]._id + "> Article Notes </button>" +
            "<button type='button' class='article btn btn-danger' id=" + data[i]._id + "> Delete From Saved </button>" +
            "<a href='" + data[i].link + "' target='_blank' id='newsLink'>" + data[i].title + 
            "</a></div>" +
            "<div class='card-body'>" + data[i].summary + "</div></div>");
        }
    }).then(function() {
        if ($("#articles").is(':empty')) {
            showEmpty();
        };
    });
};

function deleteArticle() {
    var id = this.id;
    $(this).parents(".card").remove();
    
    $.getJSON("/clear-article/" + id, function(data) {
        if ($("#articles").is(':empty')) {
            showEmpty();
        };
    });
};

function openModal() {
    var id = this.id;
    var title = $(this).siblings("a#newsLink").text();
    $("#ModalLabel").text("Note(s) for: " + title);
    $(".modal-body").attr("id", id);
    getReviews();
};

function addReview() {
    var id = $(".modal-body").attr("id");
    var newNote = $("#review").val().trim();
    if (newNote != "") {
        $.ajax({
            method: "POST",
            url: "/review/" + id, 
            data: {
                review: newNote
            }
        })
        .then(function(data) {
            getReviews();
        });
    };
    $("#review").val("");
};

function getReviews() {
    $("#review-container").empty();
    var id = $(".modal-body").attr("id");
    $.getJSON("/reviews/" + id, function(data) {
        var data = data[0].reviews;
        for (var i = 0; i < data.length; i++) {
            $("#review-container")
            .append("<div class='review-box' id='" + data[i]._id + "'>" + data[i].review + 
            "<button type='button' class='delete btn btn-danger' id=" + data[i]._id + "> X </button>" +
            "</div>");
        }
    });
};

function deleteReview() {
    var id = this.id;
    $(this).parents(".review-box").remove();
    $.getJSON("/clear-review/" + id, function(data) {
        console.log("Done.");
    });
};

});