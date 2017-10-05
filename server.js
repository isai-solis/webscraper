var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var request = require("request");
var cheerio = require("cheerio");

mongoose.Promise = Promise;

var app = express();
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));

mongoose.connect("mongodb://heroku_q8r18f9t:seh793r89a5stvvfvpceigeq8g@ds161304.mlab.com:61304/heroku_q8r18f9t");
var db = mongoose.connection;

db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});
  
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("app server listening on port " + port);
});

app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    request("https://www.fantasypros.com/nfl/", function(error, response, html) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(html);
      // Now, we grab every h2 within an article tag, and do the following:
      $("a").each(function(i, element) {
  
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this).children("a").text();
        result.link = $(this).children("a").attr("href");
  
        // Using our Article model, create a new entry
        // This effectively passes the result object to the entry (and the title and link)
        var entry = new Article(result);
  
        // Now, save that entry to the db
        entry.save(function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          }
          // Or log the doc
          else {
            console.log(doc);
          }
        });
  
      });
    });
    // Tell the browser that we finished scraping the text
    res.send("Scrape Complete");
  });
  