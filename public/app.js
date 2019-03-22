$(document).ready(function(){
// Grab the articles as a json when saved articles link is clicked 
$(document).on("click", "#savedarticles", function () {
    $.getJSON("/articles", function (data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            // Display the apropos information on the page with the delete button
            $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>" + "<button data-id='" + data[i]._id + "' id='deletearticle'>Delete Article</button>" + "<button data-id='" + data[i]._id + "' id='addnote'>Add Comment</button>");
        }
    });
});

// to add a comment after the add comment button is clicked.
$(document).on("click", "#addnote", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h2>" + data.title + "</h2>");
            // An input to enter a new title
            $("#notes").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            // A button to delete a saved note
            $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");


            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});


// When you click the Delete Note button, the note is removed from the db
$(document).on("click", "#deletenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "PUT",
        url: "/note/" + thisId,
        data: {
            // Value taken from title input
            title: $("#titleinput").val(),
            // Value taken from note textarea
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});


// When you click the Delete article button, the article is removed from the db
$(document).on("click", "#deletearticle", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "PUT",
        url: "/articles/" + thisId,
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log("article deleted");
        });
});

//scrape new articles

    //when the srape new article button is clicked
    $(document).on("click", ".scrape-new", function () {
        //go to the scraper route
        $.ajax({
            method: "GET",
            url: "/scrape/",
        })
            // With that done
        .then(function (data) {
            // Log the response
            console.log("New Links");
        });
    });

    // when click save article is clicked
    $(document).on("click", "#savearticle", function(){
        console.log("To save an article");
        // db.Article.create(result)
        // .then(function (dbArticle) {
        //     // View the added result in the console
        //     console.log(dbArticle);
        // })
        // .catch(function (err) {
        //     // If an error occurred, log it
        //     console.log(err);
        // });

    });

    // when click clear articles button
    $(document).on("click", ".clear", function(){
        $("#articles").empty();
    });
});