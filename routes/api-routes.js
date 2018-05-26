var cheerio = require("cheerio");
var request = require('request');

// require model
var db = require('../models');

var results = [];

module.exports = function (app) {


    request('https://www.nytimes.com/section/us?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=U.S.&WT.nav=page', function (e, r, html) {
        if (e) throw e
        var $ = cheerio.load(html);
        // db.Article.remove({});

    $('.story-link').each(function (i, element) {
        // grabs all tags with the class 'qustion-hyperlink'. Makes sure its a link 'a'
        var link = $(element).attr("href");

        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have

        var title = $(element).find('div > h2').text().trim();
        var summary = $(element).find('div > p').text();

        // Save these results in an object that we'll push into the results array we defined earlier
        results.push({
            headline: title,
            url: link,
            summary: summary
        });

    });

    db.Article.create(results)
        .then(function (mongoArticles) {
            // View the added result in the console
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            throw err
        });
})

app.get('/', function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {

            // If we were able to successfully find Articles, send them back to the client
            res.render('index', { article: dbArticle });

        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
})



app.post('/saved/:id', function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }).then(function (dbSaved) {

        // If we were able to successfully find Articles, send them back to the client
        res.json(dbSaved)

    })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


app.post('/unsaved/:id', function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false }).then(function (dbUnSaved) {
        console.log("dbUnSaved: ", dbUnSaved)
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbUnSaved);

    })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


app.get('/saved', function (req, res) {
    db.Article.find({ saved: true })
        .then(function (dbSavedArticles) {

            // If we were able to successfully find Articles, send them back to the client
            res.render('saved', { article: dbSavedArticles });

        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
})


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Comment.create(req.body)
        .then(function (dbNote) {

            return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});



app.get("/comment/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Comment.find({ _id: req.params.id }).then(function (dbComment) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbComment);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


}

