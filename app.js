let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let methodOverride = require("method-override");
let expresssSanitizer = require("express-sanitizer");

app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost/restful_blog_app", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expresssSanitizer());

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
//INDEX ROUTES
app.get("/blogs", function (req,res) {
    // res.render("index");
    Blog.find({}, function (err, blogs) {
        res.render("index", {blogs: blogs});

    })
})
//NEW ROUTES -> shows the form where you can make a new entry
    app.get("/blogs/new", function(req,res){
    //    Render the form
        res.render("new");
    })

//    CREATE ROUTES -> the stuff from the new route is sent here

app.post("/blogs", function (req,res) {
    //Sanitizing to remove script tags etc
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err,data) {
        if(err){
            console.log("There is an error");
        }else{

            console.log("New blog entered");
            res.redirect("/blogs");
        }

    })

});
//SHOW ROUTE -> basically describe what each of the blogs are, in detail
app.get("/blogs/:id", function (req,res) {
Blog.findById(req.params.id, function (err, foundBlg) {
    if(err){
        console.log("There is an error");
        res.redirect("/blogs");

    }else{
        res.render("show",{blog:foundBlg});

    }

} )

});


//EDIT ROUTE
app.get("/blogs/:id/edit", function (req,res) {
    Blog.findById(req.params.id, function(err, foundBlog)
    {
        if(err){
            console.log("There is an error");
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog:foundBlog});
        }
    })

});
//UPDATE ROUTE -> making the change using mongoose built in function
app.put("/blogs/:id", function (req,res) {
    // res.send("its working");
    //Sanitizing to remove script tags etc
    req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function (err,foundID) {
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }

    })

});
//DELETE ROUTE

app.delete("/blogs/:id", function (req,res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err){
            console.log("There is an error ;(")
            res.redirect("/blogs");
        }else{
            console.log("Entry just deleted!!");
            res.redirect("/blogs");
        }

    })

})



app.listen(3000, function () {
    console.log("Server is running");


})