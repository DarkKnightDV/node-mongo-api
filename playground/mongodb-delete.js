const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp' 
,{useNewUrlParser: true} 
,(err, client) => {
    if(err) {
        return console.log("Unable to connect to DB", err);
    }
    const db =client.db('TodoApp');

    //Count Before
    /* db.collection('Users').find().count().then((count) => {
        console.log("Count Before", count);
    }).catch((err) => {
        console.log("Count Failed:", err);
    }) */;

    //Count before
    /* db.collection('Users').find().count().then((count) => {
        console.log("Count Before", count);

        //Perform Delete first
        return db.collection('Users').deleteOne({
            name: 'Pankaj',
            age: 32
        });
    }).then((result) => {
        //Delete successs
        console.log("Delete Success", result.result);

        //Get After count
        return db.collection('Users').find().count();
    }).then((count) => {
        //log after count
        console.log("Count After:", count);
    }).catch((err) => {
        console.log("Operation Failed:", err);
    }); */

    //Delet First & return
    /* db.collection('Users').find().count().then((count) => {
        console.log("findOneAndDelete() Started!");
        console.log("Count Before", count);
        
        return db.collection('Users').findOneAndDelete({
            name: 'Pankaj',
            age: 32
        });
    }).then((result) => {
        console.log("Delete Success:", JSON.stringify(result, undefined, 2));
        
        return db.collection('Users').find().count();
    }).then((count) => {
        console.log("After Count:", count);
        console.log("findOneAndDelete() Completed.");
    }).catch((err) => {
        console.log("Operation Failed:", err);
    }); */

    //Delete Many
    db.collection('Todos').find().count().then((count) => {
        console.log("Delete Many started!");
        console.log("Count before", count);
        
        return db.collection('Todos').deleteMany({
            "text" : "Appointments",
            "description" : "See the doctor"
        });
    }).then((result) => {
        console.log("Delete Many Success", result.result);
        
        return db.collection("Todos").find().count();
    }).then((count) => {
        console.log("After Count:", count);
        console.log("Delete Many Completed.");
    }).catch((err) => {
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