var bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    express    = require("express"),
    app        = express();

//APP CONFIG    
mongoose.connect("mongodb://localhost:27017/restful_blog_app",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: {type:String, default: "placeholderimage.png"},
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);


//RESTFUL ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs")
});


//INDEX ROUTES
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!!!");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW ROUTES
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE ROUTES
app.post("/blogs", function(req, res){
    // CREATE BLOG
    console.log(req.body);
    // req.body.blog.body = req.sanitize(req.body.blog.body)
    console.log("===============")
    console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
            // THEN, REDIRECT TO THE INDEX
        } else {
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTES
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog: foundBlog})
        }
    });
});

// EDIT ROUTES
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE ROUTES
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.body, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs")
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE ROUTES
app.delete("/blogs/:id", function(req, res){
    // DESTROY BLOG
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");  
        }
    });
    // REDIRECT SOMEWHERE
});

app.listen(3000, process.env.IP, function(){
    console.log("SERVER HAS STARTED!!!")
});