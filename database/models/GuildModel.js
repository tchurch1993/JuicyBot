var mongoose = require('mongoose');

var GuildSchema = new mongoose.Schema({
    GuildId: Number,
    Volume: Number,
})

module.exports = new mongoose.model('guild', GuildSchema)
