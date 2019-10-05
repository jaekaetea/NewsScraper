$(document).ready(function() {

getArticles();
$(document).on("click", "button#clear", clear);
$(document).on("click", "button.article", deleteArticle);
$(document).on("click", "button.notes", openModal);

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
            "<button type='button' class='article btn btn-success' id=" + data[i]._id + "> Delete From Saved </button>" +
            "<button type='button' class='notes btn btn-info' data-toggle='modal' data-target='#Modal'> Article Notes </button>" +
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
    var title = $(this).parent().text();
    console.log($("this").data);
    console.log($(this).data.title);
    $("#ModalLabel").text("Note for: " + title);
};

});