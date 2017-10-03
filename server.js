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