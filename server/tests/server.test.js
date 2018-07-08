const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {ToDo} = require('./../models/todo');
const {User} = require('./../models/user');

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