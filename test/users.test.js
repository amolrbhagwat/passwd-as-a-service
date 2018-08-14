/* eslint-env mocha */
var request = require('supertest');

var app = require('../app');

describe('Endpoints for users', () => {
    it('/users should respond with a JSON', (done) => {
        request(app)
            .get('/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/u)
            .expect(200, done);
    });

    it('/users/0 should respond with a JSON and status 200', (done) => {
        request(app)
            .get('/users/0')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/u)
            .expect(200, done);
    });

    it('/users/100 should respond with a status 404', (done) => {
        request(app)
            .get('/users/100')
            .set('Accept', 'application/json')
            .expect(404, done);
    });
    
    it('/users/query?name=root should respond with a JSON and status 200', (done) => {
        request(app)
            .get('/users/query?name=root')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/u)
            .expect(200, done);            
    });

    it('/users/query?name=nodejs should respond with a 404', (done) => {
        request(app)
            .get('/users/query?name=nodejs')
            .set('Accept', 'application/json')
            .expect(404, done);            
    });

    it('/users/query?uid=foo should respond with a 400', (done) => {
        request(app)
            .get('/users/query?uid=foo')
            .set('Accept', 'application/json')
            .expect(400, done);            
    });

    it('/users/0/groups should respond with a JSON and status 200', (done) => {
        request(app)
            .get('/users/0/groups')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/u)
            .expect(200, done);            
    });

    it('/users/100/groups should respond with a 404', (done) => {
        request(app)
            .get('/users/100/groups')
            .set('Accept', 'application/json')
            .expect(404, done);            
    });

    it('/users/foo/groups should respond with a 404', (done) => {
        request(app)
            .get('/users/foo/groups')
            .set('Accept', 'application/json')
            .expect(400, done);            
    });
});
