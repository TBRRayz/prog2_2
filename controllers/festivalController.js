/**
 * Created by bryan on 12-12-2016.
 */
var mongoose = require('mongoose');
var festivalController = function(festival){



    var post = function (req, res) {
        var Festival = new festival(req.body);

        if(!req.body.name){
            res.status(400);
            res.send('name is required');
        }else {
            Festival.save();
            res.status(201);
            res.send(Festival);
        }
    };

    var get = function (req, res) {
        if (!req.accepts('application/json')){
            res.status(400).send('not accepted format');
        }else {

            var collection = {};
            var query = {};
            var start = 0;
            var limit = 0;
            var totalItems = 0;

            if (req.query.genre) {
                query.genre = req.query.genre;
            }


            if(req.query.start) {
                start = parseInt(req.query.start);
            }


            if(req.query.limit) {
                limit = parseInt(req.query.limit);
            }

            festival.count(function(error, count)
            {
                totalItems = count;

                if (error) {
                    console.error(error);
                } else {
                    console.log('Pages:', totalItems);

                }
                festival.find(query,null,{skip: start, limit: limit}, function (err, festivals) {
                    if (err)
                        res.status(500).send(err);

                    else {
                        collection.items = [];
                        var collectionLink = 'http://' + req.headers.host + '/api/festivals';

                        festivals.forEach(function (element, index, arry) {
                            var newFestival = element.toJSON();
                            newFestival._links = {};
                            newFestival._links.self = {};
                            newFestival._links.self.href = 'http://' + req.headers.host + '/api/festivals/' + newFestival._id;
                            newFestival._links.collection = {};
                            newFestival._links.collection.href = collectionLink;
                            collection.items.push(newFestival);

                        });

                        collection._links = {};
                        collection._links.self = {};
                        collection._links.self.href = collectionLink;

                        collection.pagination = {};
                        collection.pagination.currentItems = collection.items.length;
                        collection.pagination.currentPage = Math.ceil(start / limit);
                        collection.pagination.totalItems = totalItems;
                        collection.pagination.totalPages = Math.ceil(totalItems / limit);

                        collection.pagination._links = {};
                        collection.pagination._links.first = {};

                        collection.pagination._links.first.page = 1;
                        collection.pagination._links.first.href = 'http://' + req.headers.host + '/api/festivals?limit=' + limit;

                        collection.pagination._links.last = {};
                        collection.pagination._links.last.page = collection.pagination.totalPages;
                        collection.pagination._links.last.href = 'http://' + req.headers.host + '/api/festivals?start=' + (totalItems - limit + 1) + '&limit=' + limit;

                        collection.pagination._links.previous = {};
                        if(collection.pagination.currentPage > 1) {
                            collection.pagination._links.previous.page = collection.pagination.currentPage - 1;
                            collection.pagination._links.previous.href = 'http://' + req.headers.host + '/api/festivals?start=' + (start - limit) + '&limit=' + limit;
                        } else {
                            collection.pagination._links.previous.page = 1;
                            collection.pagination._links.previous.href = 'http://' + req.headers.host + '/api/festivals?limit=' + limit;
                        }

                        collection.pagination._links.next = {};
                        if(collection.pagination.currentPage < collection.pagination.totalPages) {
                            collection.pagination._links.next.page = collection.pagination.currentPage + 1;
                            collection.pagination._links.next.href = 'http://' + req.headers.host + '/api/festivals?start=' + (start + limit) + '&limit=' + limit;
                        } else {
                            collection.pagination._links.next.page = collection.pagination.totalPages;
                            collection.pagination._links.next.href = 'http://' + req.headers.host + '/api/festivals?start=' + (totalItems - limit + 1) + '&limit=' + limit;
                        }


                        res.json(collection);
                    }
                });
            });
        }
        };

        return{
            post:post,
            get: get

        }
};

module.exports = festivalController;