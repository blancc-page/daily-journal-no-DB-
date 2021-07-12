//jshint esversion:6

// require expresss and set up express app
const express = require("express");
const app = express();

// require all middle-wear
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

// require DB
const mongoose = require("mongoose");

// connect to mongoose 
mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("Successfully connected to DB!")
});

// create blogSchema
const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String
});

// create model
const BlogPost = mongoose.model("BlogPost", blogPostSchema);



// declare the starting paragraphs of each page
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


// sets the browser's view engine to ejs 
app.set('view engine', 'ejs');

// sets the express app to use bodyparser
app.use(bodyParser.urlencoded({extended: true}));

// tells the server to look for static files in the public folder
app.use(express.static("public"));

let blogPosts = [];
const composeObject = {};
const heading ="";
const body ="";

app.get("/", function (req,res) {
  res.render("home", {homeStartingContent: homeStartingContent, blogPosts: blogPosts, heading: heading, body: body, _:_});
})

// use body-parser to request the content of the tilteInput and contentInput 
app.post("/", function (req,res) {
  heading = req.body.titleInput;
  body = req.body.contentInput;
})

app.get("/compose", function (req,res) {
  res.render("compose");

});

app.post("/compose", function (req,res) {
// javascript object containing the title and content of the blog post
  const composeObject = {
    title: req.body.titleInput,
    content: req.body.contentInput
  }


const blogDoc = new BlogPost({
  title: req.body.titleInput,
  content: req.body.contentInput
});
// push the compose object into the blogPosts array and redirect to the home route 
  blogPosts.push(composeObject);
  res.redirect("/");
})

app.get("/about", function (req,res) {
  res.render("about", {aboutContent: aboutContent})
})

app.get("/contact", function (req,res) {
  res.render("contact",{contactContent: contactContent})
})

app.get("/blogPosts/:postName", function (req, res) {

// use array.forEach() to cycle through the blogPosts array, check if the storedTitle matches the routeParam and if so render the post.ejs
  blogPosts.forEach(function (blogPost) { 
  
    const storedTitle = blogPost.title;
    const storedContent = blogPost.content;

// using _.kebabCase() to store both the blogPost.title and the routeParam in lowercase with hyphens in between each word 
    const kebabStoredTitle = _.kebabCase(blogPost.title);
    const kebabRouteParam = _.kebabCase(req.params.postName);

    if(kebabStoredTitle === kebabRouteParam){

      res.render("post", { storedTitle: storedTitle, storedContent: storedContent, kebabStoredTitle: kebabStoredTitle});

    } 
  })  
  }
);

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
