var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

//require scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// require modes
var db = require("./models");

var PORT = process.env.PORT || 4002;

//initialize express
var app = express();

// middleware configuration
app.use(logger("dev"));
// parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// make public folder static
app.use(express.static("public"));

// make the database connection
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapethenews";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//api routes
// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    
    // First, we grab the body of the html with axios
    axios.get("http://www.echojs.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        let newsCounter = 0;
        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function (i, element) {
            // Save an empty result object
            var result = {};
            newsCounter++;
            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    // console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });
        // Send a message to the client on how many records were saved
        console.log(newsCounter + " news articles were saved");
    });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
        .then(articles => res.json(articles));
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(articles => res.json(articles));
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    console.log("my req");
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
    db.Note.create(req.body)
        .then(dbNote => db.Article.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { note: dbNote._id } }
        ))
        .then(dbArticle => res.json(dbArticle))
        .catch(err => res.json(500, err))
});

// Route deleting a note
app.put("/note/:id", function (req, res) {
    db.Note.remove(req.body)
        .then(dbNote => db.Note.findOneAndDelete(
            { _id: req.params.id }
        ))
        .then(dbArticle => res.send("Note removed"))
        .catch(err => res.json(500, err))
});

// Route deleting an article
app.put("/articles/:id", function (req, res) {
    // delete article from database
    console.log("The article _id to delete " + req.params.id);
    db.Article.findOneAndDelete({ _id: req.params.id })
        .catch(err => res.json(500, err));
    // res.redirect("/articles");
});
// start the server
app.listen(PORT, function () {
    console.log("App started and listening on port " + PORT);
});