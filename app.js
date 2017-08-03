var bodyParser = require("body-parser"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express(),
methodOverride  = require("method-override");

mongoose.Promise = global.Promise; // removes the deprecated promise warning
mongoose.connect("mongodb://localhost/restful_blog_app", { useMongoClient: true });
app.set("view engine", "ejs"); 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method")); //treats it as the method instead of the POST

//creating a new schema
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created: {type:Date, default:Date.now} //gives the date a default date to now.
})

//made schema into model
var Blog = mongoose.model("Blog", blogSchema);

//Restful Routes

//normal for homepage to go to index page.
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//index route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs) {
        if(err){
            console.log("Error");
        } else {
            res.render("index", {blogs:blogs}); //passed in blogs into page
        }
    });
});

//new route. just returns a new form all the time
app.get("/blogs/new", function(req, res) {
    res.render("new");
})

// create route. creates new blog then redirects.
app.post("/blogs", function(req, res) {
    Blog.create(req.body.blog, function(err, newBlog){
        if (err) {
            res.render("new");
        } else{
            res.redirect("/blogs"); //usually doesnt redirect to blogs. Should go to show request
        }
        
    })
})

//Show request. shows more information of the blog after read more
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog) {
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog:foundBlog});
        }
    })
})

// Edit route. very similar to new, but gets past info and keeps it there.
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog:foundBlog})
        }
    })
})

//update route
app.put("/blogs/:id", function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

//delete route
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/blogs"); //change later on to have message that says didnt delete
        } else {
            res.redirect("/blogs");
        }
    })
    }
)

//check if it works at beginning
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("SERVER IS RUNNING");
})