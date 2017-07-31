var bodyParser = require("body-parser"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

mongoose.Promise = global.Promise; // removes the deprecated promise warning
mongoose.connect("mongodb://localhost/restful_blog_app", { useMongoClient: true });
app.set("view engine", "ejs"); 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

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
    res.send("helo friend");
})
//check if it works at beginning
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("SERVER IS RUNNING");
})