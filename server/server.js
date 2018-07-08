const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./mongoose'); 
const {ToDo} = require('./models/todo');
const {User} = require('./models/user');

const port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());

app.post('/todos' , (req, res) => {
    console.log(req.body);
    var todo = new ToDo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        console.log("Todo created successfully:", doc);
        res.send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.post('/users', (req, res) => {
    var user = new User({
        email: req.body.email,
        name: req.body.name
    });

    user.save().then((user) => {
        res.send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.listen(port, () => {
    console.log(`Server started on ${port}`);
})
