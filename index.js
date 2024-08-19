import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";

const app = express();
const port = 3000;
let num_post = 1;
let search_string = "Search post name";
let hide = "hide";
const genres = ["Technology"];
const blogs = [
    {
        "id": 1,
        "image": "assets/Technology.jpg",
        "title": "Positive Effects of Gaming",
        "author": "Devank Harripersad",
        "genre": "Technology",
        "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor elementum eros. Sed molestie interdum tempor. Nulla neque quam, blandit quis nulla vel, imperdiet rhoncus ligula. In et tempor diam. Maecenas iaculis dapibus orci nec vestibulum. Vestibulum cursus orci blandit molestie interdum. Duis vitae convallis nunc. Aliquam elit tortor, mattis eu mi eu, rhoncus ultrices orci. Sed fringilla massa ac lorem bibendum pellentesque. Fusce condimentum lectus in erat laoreet euismod. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam sit amet consequat lorem, vel viverra justo. Sed ut arcu a nibh consequat egestas vitae nec quam.",
        "date": new Date(),
    }
];

// Enable body parser
app.use(bodyParser.urlencoded({extended: true}));
// Enable to use style sheet
app.use(express.static("public"));
// Aloow file uploading usage
app.use(fileUpload());

// Main page used for most redirects
app.get("/", (req, res) => {
    hide = "hide";
    res.render("index.ejs", {articles: blogs, search: search_string, filter: hide, genre: genres});
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

// Page used to show the relevant articles when clicked on preview card link
app.post("/article", (req, res) => {
    let id = req.body.fullArticle - 1;

    res.render("article.ejs", {article: blogs[id]});
});

// Search functionality when user searches for a blog, if search exists it will render a new page with searched articles
app.post("/search", (req, res) => {
    const temp = [];

    if(req.body.blogSearch){
        const split = req.body.blogSearch.split(" ");

        for(let i=0; i<blogs.length; i++){
            for(let j=0; j<split.length; j++){
                if(blogs[i].title.toLowerCase().includes(split[j].toLowerCase())){
                    temp.push(blogs[i]);
                }
            }
        }

        if(temp.length > 0){
            search_string = "Search post name";
            hide = "show";
            res.render("index.ejs", {articles: temp, search: search_string, filter: hide, genre: genres});
        } else {
            search_string = "No post found";
            res.redirect("/");
        }
    } else if(req.body.buttonSearch) {
        for(let i=0; i<blogs.length; i++){
            if(blogs[i].genre.toLowerCase() == req.body.buttonSearch.toLowerCase()){
                temp.push(blogs[i]);
            }
        }

        if(temp.length > 0){
            search_string = "Search post name";
            hide = "show";
            res.render("index.ejs", {articles: temp, search: search_string, filter: hide, genre: genres});
        } else {
            search_string = "No genre found";
            res.redirect("/");
        }
    } else {
        res.redirect("/");
    }
});

// Route if user wants to add a new blog, used with the submit. This just takes the user to the page
app.post("/add", (req, res) => {
    res.render("add.ejs");
});

// Used to get all the new blogs details and add the blog to the list to be generated on the main page, 
// redirects to "/"
app.post("/submit", (req, res) => {
    if(req.body.back == '') {
        res.redirect("/");
    } else {
        let author = "Anonymous";
        let image = "assets/"+req.body.genre+".jpg"

        if(req.body.author != '') {
            author = req.body.author.charAt(0).toUpperCase() + req.body.author.slice(1);
        }

        if(req.body.image) {
            let file = req.files.image;
            let dir = "C:/Users/User/Desktop/Web Development 100 Days/Projects/Capstone Project 3 - Blog Site/public/assets/"
            file.mv(dir+req.files.image.name);
            image = "assets/"+req.files.image.name;
        }

        for(let i=0; i<genres.length; i++){
            if(!genres[i].includes(req.body.genre)){
                genres.push(req.body.genre);
            }
        }

        let new_item = {
            "id": num_post += 1,
            "image": image,
            "title": req.body.title.charAt(0).toUpperCase() + req.body.title.slice(1),
            "author": author,
            "genre": req.body.genre,
            "text": req.body.message,
            "date": new Date(),
        };
        
        blogs.push(new_item);
        res.redirect("/");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});