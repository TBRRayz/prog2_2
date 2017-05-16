/**
 * Created by bryan on 12-12-2016.
 */
var should = require('should');
var sinon = require('sinon');

describe('festival controller tests:', function(){
    describe('Post', function(){
        it('should no allow an emmty name', function (){
            var festival = function(festival){this.save = function(){}};

            var req = {
                body: {
                    location: 'walibi'
                }
            }

            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            }
            var festivalController = require('../controllers/festivalController')(festival);

            festivalController.post(req,res);

            res.status.calledWith(400).should.equal(true, 'Bad Status ' + res.status.args[0][0]);
            res.send.calledWith('Name is required').should.equal(false);
        })

    })
});