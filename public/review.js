$(document).ready(function() {

getArticles();
$(document).on("click", "button#clear", clear);
$(document).on("click", "button.article", deleteArticle);
$(document).on("click", "button.notes", openModal);
$(document).on("click", "button.review", addReview);

function clear() {
    $("#articles").empty();
    $.getJSON("/clear-saved", function(data) {
        console.log("Cleared.");
    });
};

function getArticles() {
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
    });
};

function deleteArticle() {
    var id = this.id;
    $(this).parents(".card").remove();
    
    $.getJSON("/clear-article/" + id, function(data) {
        console.log("Done.");
    });
};

function openModal() {
    var id = this.id;
    console.log(id);
    var title = $(this).siblings("a#newsLink").text();
    $("#ModalLabel").text("Note(s) for: " + title);
    $(".modal-body").empty();
    $(".modal-body").attr("id", id);
    $(".modal-body")
    .append("<textarea id='review' placeholder='Add a Note' rows='4' cols='60'>")
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
};

function getReviews() {
    var id = $(".modal-body").attr("id");
    $.getJSON("/reviews/" + id, function(data) {
        console.log(data[0].reviews);
        // for (var i = 0; i < data.length; i++) {
        //     $(".modal-body")
        //     .append("<div class='card'><div class='card-header'>" + 
        //     "<button type='button' class='notes btn btn-success' data-toggle='modal' data-target='#Modal' id=" + data[i]._id + "> Article Notes </button>" +
        //     "<button type='button' class='article btn btn-danger' id=" + data[i]._id + "> Delete From Saved </button>" +
        //     "<a href='" + data[i].link + "' target='_blank' id='newsLink'>" + data[i].title + 
        //     "</a></div>" +
        //     "<div class='card-body'>" + data[i].summary + "</div></div>");
        // }
    });
};

});