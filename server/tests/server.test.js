const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {ToDo} = require('./../models/todo');
const {User} = require('./../models/user');

const todos = [{
    _id: new ObjectID(),
    text: "Todo Unit Test1",
    completed: true
},{
    _id: new ObjectID(),
    text: "Todo Unit Test2",
    completed: false,
    completedAt : new Date()
}];

beforeEach((done) => {
    ToDo.remove({}).then(()=> {
        return ToDo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos', (done) => {

    // Test Case# 1
    var text = "Unit Testing Mongoose";
    it('Should create a Todo', (done) => {
        request(app).post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                ToDo.find({text : "Unit Testing Mongoose"}).then((docs) => {
                    expect(docs.length).toBeGreaterThan(0);
                    expect(docs[0].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            });   
    });

    // Test Case# 2
    it('Should not create for invalid values', (done) => {
        var initialCount = 0;
        ToDo.find().then((docs) => {
            initialCount = docs.length;
        }).then(() => {
            request(app).post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err) {
                    done(err);
                }

                ToDo.find().then((docs) => {
                    // console.log(`Initial count - ${initialCount}, Final Count- ${docs.length}`);
                    expect(docs.length).toBe(initialCount);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
        }).catch((err) => {
            done(err);
        });
    });

    // it()

});

describe('GET /todos', (done)=> {
    it('Get all Todos', (done) => {
        request(app).get('/todos')
                .expect(200)
                .expect((res) => {
                    expect(res.body.todos.length).toBeGreaterThan(0);
                }). end(done);
    });
});

describe('GET /todos/:id' , (done) => {
    it('Should return Todo for given ID', (done) => {
        request(app).get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            }).end(done);
    });

    it('Should not return for Invalid ID', (done) => {
        request(app).get(`/todos/${todos[0]._id.toHexString()}abc`)
            .expect(404)
            .end(done);
    });

    it('Should not return for Missing but Valid ID' , (done) => {
        request(app).get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', (done) => {
    it('Should update todo', (done) => {
        var id = todos[0]._id.toHexString();
        var toUpdate = {"text": "Test Case 1", "completed": true};
        request(app).patch(`/todos/${id}`)
            .send(toUpdate)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(toUpdate.text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeDefined;
            }).end(done);
    });

    it('Should not update cmpletedAt', (done) => {
        var id = todos[1]._id.toHexString();
        var toUpdate = {"text": "Test Case 1", "completed": false};

        request(app).patch(`/todos/${id}`)
            .send(toUpdate)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(toUpdate.text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBeNull;
            }).end(done);
    });
});

describe('DELETE /todos/:id', (done) => {
    it('Should delete by Id', (done) => {
        var id = todos[0]._id.toHexString();
        request(app).delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res).toBeDefined;
                expect(res.body.todo).toExist;
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                ToDo.findById(id).then((todo) => {
                    expect(todo).toNotExist;
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('Should not delete for invalid ID', (done) => {
        request(app).delete('/todos/123sdsffdf')
            .expect(404)
            .end(done);
    });

    it('Should not delete missing Id', (done) => {
        request(app).delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    });
});

    // Test Case User
describe('POST /users', (done) => {

    var user = {
        name: "Amanda",
        email: "amanda@gmail.com"
    }

    //Test Case# 1
    it('Should create a user' , (done)=> {
        request(app).post("/users")
            .send(user)
            .expect(200)
            .expect((res) => {
                expect(res.body.name).toBe(user.name);
                expect(res.body.email).toBe(user.email);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }

                User.find(user).then((result) => {
                    expect(result.length).toBeGreaterThan(0);
                    expect(result[0].name).toBe(user.name);
                    expect(result[0].email).toBe(user.email);     
                    done();               
                }).catch((err) => {
                    done(err);
                });
            });
    });
});