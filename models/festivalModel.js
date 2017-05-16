var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var festivalModel = new Schema({
    name: {type: String},
    location: {type: String},
    genre: {type: String},
    age: {type: String},
    date: {type: String}
});

module.exports= mongoose.model('Festival', festivalModel);


