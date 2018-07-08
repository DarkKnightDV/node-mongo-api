const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp' 
,{useNewUrlParser: true} 
,(err, client) => {
    if(err) {
        return console.log("Unable to connect to DB", err);
    }
    const db =client.db('TodoApp');

    //Find One and Update
    db.collection('Users').find({
        name: 'Pankaj'
    }).toArray().then((result) => {
        console.log("FindOneAndUpdate started!");
        console.log("Before Update", JSON.stringify(result, undefined, 2), "\n_________________");
        
        return db.collection('Users').findOneAndUpdate({
            name: 'Pankaj'
        }, {
            $set: {
                name : 'Pankaj Pandey'
            },
            $inc : {
                age: -5
            }
        }, {
            returnOriginal: false
        });
    }).then((result) => {
        console.log("Update Success", JSON.stringify(result, undefined, 2));
        
        // return db.collection("Todos").find().count();
    })/* .then((count) => {
        console.log("After Count:", count);
        console.log("FindOneAndUpdate Completed.");
    }) */.catch((err) => {
        console.log("Operation Failed:", err);
    });

    //Count After
    /* db.collection('Users').find().count().then((count) => {
        console.log("Count After:", count);
    }).catch((err) => {
        console.log("Delete Failed:", err);
    }); */
    // client.close();

});