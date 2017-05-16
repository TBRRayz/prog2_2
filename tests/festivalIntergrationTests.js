/**
 * Created by bryan on 12-12-2016.
 */
var should = require('should');
var request = require('supertest');
var app = ('../app.js');
var mongoose = require('mongoose');
var festival = mongoose.model('Festival');
var agent = request.agent(app);

describe('festival crud test', function(){
    it('should allow a festival to be posted anf return a read en _id', function (done) {
        var festivalPost = {name:'fissa', location:'benthuizen', genre:'hard', age:'18', data:'20-09-1994'};

        agent.post('/api/books')
            .send(festivalPost)
            .expect(200)
            .end(function (err, results) {
                results.body.read.should.equal(false);
                results.body.have.property('_id');
                done();

                
            })

        
    });
    afterEach(function(done){
        festival.remove().exec();
        done();
    })

});
