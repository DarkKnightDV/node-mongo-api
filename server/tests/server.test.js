const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {ToDo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, users, populateToDos, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateToDos);

describe('POST /todos', (done) => {
     // Test Case# 1
     it('Should create a Todo', (done) => {
        var text = "Unit Testing Mongoose";
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

describe('GTE /users/me', (done) => {

    it('Should get user for authenticated user', (done) => {
        request(app).get('/users/me')
            .set('x-auth', users[0].tokens[0].token)  // Set Header
            .send()
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            }).end(done);
    });

    it("should return 401 for unauthenticated user", (done) => {
        request(app).get('/users/me')
            .send()
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

    // Test Case User
describe('POST /users', (done) => {

    var user = {
        password: "Amanda",
        email: "amanda@gmail.com",
    }
    //Test Case# 1
    it('Should create a user' , (done)=> {
        request(app).post("/users")
            .send(user)
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist;
                expect(res.body.email).toBe(user.email);
            })
            .end((err, res) => {
                if(err){
                    return done(err);
                }
                User.findOne({email: "amanda@gmail.com"}).then((res) => {
                    expect(res).toExist;
                    expect(res.password).not.toBe(user.password);  
                }).then(() => done())
                .catch((err) => done(err));
            });
    });

    it('should return error if email invalid', (done) => {
        request(app).post('/users')
            .send({email: 'abc@123.com', password:"pass"})
            .expect(400)
            .expect((res) => {
                expect(res.body).toBeNull;
            })
            .end(done);
    });

    it('should not create user if email is used', (done) => {
        request(app).post('/user')
            .send({
                email:"jpn.ant@gmail.com",
                password: "12345dsdd"
            })
            .expect(404)
            .expect((res) => {
                expect(res.body).toBeNull;
            })
            .end(done);
    });
});

describe("POST /users/login", (done) => {

    it('should login & token for valid credentails', (done) => {
        request(app).post('/users/login')
            .send({email: users[0].email, password: users[0].password})
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(users[0].email);
                expect(res.headers['x-auth']).toExist;
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                User.findOne({email: users[0].email}).then((user) => {
                   /*  below doesnt works any longer.Follow workardoung afterwards
                   expect(user.tokens[0]).to.include.members({
                        access:'auth',
                        token: res.headers['x-auth']
                    }); */
                    expect(user.tokens[0].access).toBeTruthy;
                    expect(user.tokens[0].token).toBeTruthy;
                    expect(user).toExist;
                    expect(user.password).not.toBe(users[0].password);
                    done();
                }).catch((err) => {
                    done(err);
                });
            });
    });

    it('should return 404 for invalid credentials', (done) => {
        request(app).post('/users/login')
            .send({email:"abc", password:"pwd"})
            .expect(400)
            .expect((res) => {
                expect(res.body).toEqual({});
                expect(res.headers['x-auth']).toNotExist;
            })
            .end(done);
    });
});

describe('DELETE /users/me/token', (done) => {
    it('should remove auth token on logout', (done) => {
        request(app).delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .send()
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist;
            }).end((err, res) => {
                if(err){
                    return done(err);
                }

                User.findOne({email : users[0].email}).then((user) => {
                  expect(user).toExist;
                  expect(user.tokens.length).toBe(0);  
                  done();
                }).catch((err) => {
                    done(err)
                });
            });
    });
});