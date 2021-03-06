const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {ToDo} = require('./../../models/todo');
const {User} = require('./../../models/user');

var userIdOne = new ObjectID();
var userIdTwo = new ObjectID();
const users = [{
    _id: userIdOne,
    email: "jpn.ant@gmail.com",
    password : "UserOnePass",
    tokens: [{
        'access': 'auth',
        "token" : jwt.sign({_id: userIdOne, "access": "auth"}, process.env.JWT_SECRET).toString()
     }]
    } , {
    _id: userIdTwo,
    password: "PasswordTwo",
    email:"jen.ant@gmail.com",
    tokens: [{
        'access': 'auth',
        "token" : jwt.sign({_id: userIdTwo, "access": "auth"}, process.env.JWT_SECRET).toString()
    }] 
}];

const todos = [{
    _id: new ObjectID(),
    text: "Todo Unit Test1",
    completed: true,
    _creator: userIdOne
},{
    _id: new ObjectID(),
    text: "Todo Unit Test2",
    completed: false,
    completedAt : new Date(),
    _creator : userIdTwo
}];

const populateToDos = (done) => {
    ToDo.remove({}).then(()=> {
        ToDo.insertMany(todos);
    }).then(() => done())
    .catch((err) => done(err));
};

const populateUsers = (done) => {
    User.remove({}).then(()=>{
        var user1 = new User(users[0]).save();
        var user2 = new User(users[1]).save();
        Promise.all([user1, user2]);
    }).then(() => done())
    .catch((err) => done(err));
}

module.exports= {todos, users, populateToDos, populateUsers};