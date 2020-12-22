var mongoose = require('mongoose');

var GuildSchema = new mongoose.Schema({
    GuildId: Number,
    Volume: { type: Number, default: 50 },
})

module.exports = new mongoose.model('guild', GuildSchema)
