// const MongoClient = require('mongodb').MongoClient; // Usual declration
const {MongoClient, ObjectID} = require("mongodb");  // With Object Destructuring

var obj = new ObjectID();
console.log("ID:::", obj);

MongoClient.connect("mongodb://localhost:27017/TodoApp", { useNewUrlParser: true }, (err, client) => {
    if(err) {
        return ("Unable to connect to database:", err);
    }
    const db = client.db('TodoApp');
    // db.collection('Todos').insertOne({
    //     text: "Appointments",
    //     description: "See the doctor"
    // }, (err, result) => {
    //     if(err) {
    //         return console.log("Unable to insert into database", err);
    //     }
    //     console.log("Value inserted:", JSON.stringify(result.ops, undefined, 2));
    // });

    db.collection('Users').insertOne({
        name: "Pankaj",
        age: 32,
        location: "Singapore",
        occupation: "Architect"
    } , (err, result) => {
        if(err){
            return console.log("Unable to insert to DB", err);
        } 
        console.log("Success::", JSON.stringify(result.ops, undefined, 2));
        console.log("Result::", JSON.stringify(result, undefined, 2));
        console.log("Timestamp::", result.ops[0]._id.getTimestamp());
    });

    client.close();
});