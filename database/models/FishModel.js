var mongoose = require('mongoose');

var FishSchema = new mongoose.Schema({
    FishId: Number,
    FishName: String,
    FishExperience: Number,
    FishImage: String
})


module.exports = mongoose.model('fish', FishSchema)