var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    GuildId: { type: Number, required: true },
    UserId: { type: Number, required: true },
    TotalExperience: { type: Number, default: 0 },
    Level: { type: Number, default: 0 },
    TotalFish: { type: Number, default: 0 },
    TalkVoice: { type: String, default: 'en-US'}
})

module.exports = mongoose.model('users', UserSchema)