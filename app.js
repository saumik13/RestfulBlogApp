let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//Creating the blog Schema here which has a title, image, body

let blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default: Date.now}
});
//Making model here

let Blog = mongoose.model("Blog", blogSchema);

//Making a blog entry here

// Blog.create(
//     {
//         title: "Hot",
//         image: "https://images.unsplash.com/photo-1495063378081-52411c3eedf1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
//         body: "Look at me"
//     }
// );
//ROUTES
app.get("/", function (req,res) {
    res.redirect("/blogs");

})
app.get("/blogs", function (req,res) {
    // res.render("index");
    Blog.find({}, function (err,blogs) {
        res.render("index", {blogs:blogs});

    })


})





app.listen(3000, function () {
    console.log("Server is running");


})