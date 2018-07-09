const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./mongoose'); 
const {ToDo} = require('./models/todo');
const {User} = require('./models/user');

const port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json());

app.post('/todos' , (req, res) => {
    // console.log(req.body);
    var todo = new ToDo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        // console.log("Todo created successfully:", doc);
        res.send(doc);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    ToDo.find({}).then((todos) => {
        // Below you can send directly the result as well. However, if you send array, it gives you 
        // additional option to add your custom return param to the data send to client side,
        // which can be used for processing something else. EG: {todos, mycustom: "abc", mycustom2, "def"}
        res.send({todos});
    }).catch((err) => {
        log("Error:", err);
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send({
            "error": "Invalid Id"
        });
    } else {
        // ToDo.find({_id: id}).then((todos) => {
        ToDo.findById(id).then((todo) => {
            // if(todos.length > 0){
            if(todo){
                res.send({todo});
            } else {
                res.status(404).send({"msg": `No Todos found for the id(${id})`})
            }
        }).catch((err) => {
            res.status(400).send(err);
        });
    }
});

app.post('/users', (req, res) => {
    var user = new User({
        email: req.body.email,
        name: req.body.name
    });

    user.save().then((user) => {
        // console.log("User created successfully:", user);
        res.send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.listen(port, () => {
    console.log(`Server started on ${port}`);
})

module.exports = {app};