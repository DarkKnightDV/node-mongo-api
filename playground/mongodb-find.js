const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', {useNewUrlParser:true}, (err, client) => {
    const db = client.db('TodoApp');
    /* db.collection('Todos').find({
        // "text": "Reminders",
        // "description": "Check Emails"
        "_id": new ObjectID("5b418588901677147ce80b7e")
    }).toArray().then((docs) => {
        console.log("Todos");
        console.log(JSON.stringify(docs, undefined, 2));
    }).catch((err) => {
        console.log("Unable to get documents", err);
    }); */

    db.collection('Users').find().count().then((count) => {
        console.log("Users count is ", count);
    }).catch((err) => {
        console.log("Unable to get documents", err);
    });

    // client.close();
});