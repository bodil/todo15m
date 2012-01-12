var express = require("express");
var mongoose = require("mongoose");

mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/todo15m");

var Todo = mongoose.model("Todo", new mongoose.Schema({
    todo: String,
    done: { type: Boolean, default: false }
}));

var app = express.createServer();
app.use(express.bodyParser());
app.use(express.errorHandler());
app.use(express.static(__dirname + "/static"));

app.get("/", function(req, res) {
    Todo.find({}, function(err, docs) {
        res.render("index.jade", { docs: docs, layout: false });
    });
});

app.post("/new", function(req, res) {
    var doc = new Todo();
    doc.todo = req.param("todo");
    doc.save(function(err) {
        res.redirect("/");
    });
});

app.post("/done/:id", function(req, res) {
    Todo.findById(req.param("id"), function(err, doc) {
        doc.done = !doc.done;
        doc.save(function(err) {
            res.redirect("/");
        });
    });
});

app.post("/delete/:id", function(req, res) {
    Todo.findById(req.param("id"), function(err, doc) {
        doc.remove(function(err) {
            res.redirect("/");
        });
    });
});

app.listen(parseInt(process.env.PORT, 10) || 1337);
