/**
 * Created by bryan on 11-12-2016.
 */
var express = require('express');
var mongoose = require('mongoose');



var routes = function (festival) {
    var festivalRouter = express.Router();

    festivalController = require('../controllers/festivalController')(festival);
    festivalRouter.route('/')

        .post(festivalController.post)
        .get(festivalController.get)
        .options(function(req,res) {
            res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
            res.header('Allow', 'GET, POST, OPTIONS');
            res.header('Access-Control-Allow-Origin', '*');
            res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, charset");

            res.status(200).send();
        });

    festivalRouter.use('/:festivalId', function (req,res,next) {
        festival.findById(req.params.festivalId, function(err, festival) {
            if(err)
                res.status(500).send(err);

            else if(festival){
                req.festival = festival;
                next();
            }else{
               res.status(404).send('no festival found');
            }


        });
    });
    festivalRouter.route('/:festivalId')


        .get(function (req, res) {


            var returnFestival = req.festival.toJSON();
            returnFestival._links = {};
            returnFestival._links.self = {};
            returnFestival._links.self.href = 'http://' + req.headers.host + '/api/festivals/' + returnFestival._id;

            returnFestival._links.collection = {};
            returnFestival._links.collection.href =  'http://' + req.headers.host + '/api/festivals';

            returnFestival._links.FilterByThisGenre =  'http://' + req.headers.host + '/api/festivals/?genre=' + returnFestival.genre;




            res.json(returnFestival);
        })
        .put(function(req,res){

                    req.festival.name = req.body.name;
                    req.festival.location = req.body.location;
                    req.festival.genre = req.body.genre;
                    req.festival.age = req.body.age;
                    req.festival.date = req.body.date;

                    if(req.festival.name == "" || req.festival.location == "" || req.festival.genre == "" || req.festival.age == "" || req.festival.date == ""){

                        res.status(400).send("verplichten velden zijn leeg");

                    }else {
                        req.festival.save(function (err) {
                            if (err)
                                res.status(500).send(err);
                            else {
                                res.json(req.festival);
                            }

                        });
                    }


    })
        /*.patch(function (req,res) {
            if(req.body._id)
                delete  req.body._id;

            for(var p in req.body)
            {
                req.festival[p] = req.body[p];
            }

            req.festival.save(function (err) {
                if(err)
                    res.status(500).send(err);
                else{
                    res.json(req.festival);
                }

            });
})*/
        .delete(function (req,res) {
            req.festival.remove(function (err) {
                if(err)
                    res.status(500).send(err);
                else{
                    res.status(204).send("removed");
                }
            });
        })
        .options(function (req,res) {

            res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');

            res.header('Access-Control-Allow-Origin', '*');
            res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, charset");


            //res.send(" de options zijn POST en GET");
            res.status(200).send();

        });

    return festivalRouter;
};

module.exports = routes;