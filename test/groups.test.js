/* eslint-env mocha */
var request = require('supertest');

var app = require('../app');

describe('Endpoints for groups', () => {
    it('/groups should respond with a JSON', (done) => {
        request(app)
            .get('/groups')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/u)
            .expect(200, done);
    });

    it('/groups/0 should respond with a JSON and status 200', (done) => {
        request(app)
            .get('/groups/0')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/u)
            .expect(200, done);
    });

    it('/groups/100 should respond with a status 404', (done) => {
        request(app)
            .get('/groups/100')
            .set('Accept', 'application/json')
            .expect(404, done);
    });

    it('/groups/query?name=root should respond with a JSON and status 200', (done) => {
        request(app)
            .get('/groups/query?name=root')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/u)
            .expect(200, done);            
    });
    
    it('/groups/query?name=nodejs should respond with a 404', (done) => {
        request(app)
            .get('/groups/query?name=nodejs')
            .set('Accept', 'application/json')
            .expect(404, done);            
    });

    it('/groups/query?gid=foo should respond with a 400', (done) => {
        request(app)
            .get('/groups/query?gid=foo')
            .set('Accept', 'application/json')
            .expect(400, done);            
    });
});
