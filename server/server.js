const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const config = require('./config/config');
const {mongoose} = require('./mongoose'); 
const {ToDo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT;
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

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)) {
        return res.status(404).send({"error": "Invalid Object Id"});
    } 
    ToDo.findByIdAndRemove(id).then((todo) => {
        if(!todo) {
            return res.status(404).send({"error": "No object found"});
        } 
              
        res.send({"success" : "Object Deleted", todo});
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.patch("/todos/:id", (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) {
        return res.status(400).send({"error":"id not found"});
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date();        
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    ToDo.findByIdAndUpdate(id, { $set: body}, {new : true}).then((todo) => {
        if(!todo) {
            return res.status(404).send({"error":"Update failed"});
        }

        res.send({"success":"Object Updated", todo});
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.get('/users/me', authenticate ,(req, res) => {
    res.send(req.user);
});

app.post('/users', (req, res) => {
    var userData = _.pick(req.body, ['email', 'password']);
    var user = new User(userData);

    user.save().then(() => {
        return user.getAuthToken();
        // res.send(user);
    }).then((token) => {
        res.header({'x-auth' : token}).send(user);
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.listen(port, () => {
    console.log(`Server started on ${port}`);
})

module.exports = {app};