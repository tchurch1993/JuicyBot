var mongoose = require('mongoose');

var GuildSchema = new mongoose.Schema({
    GuildId: Number,
})

module.exports = new mongoose.model('guild', GuildSchema)
