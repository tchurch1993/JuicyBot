var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    GuildId: { type: Number, required: true },
    UserId: { type: Number, required: true },
    TotalExperience: { type: Number, default: 0 },
    Level: { type: Number, default: 0 },
    TotalFish: { type: Number, default: 0 }
})

module.exports = mongoose.model('users', UserSchema)