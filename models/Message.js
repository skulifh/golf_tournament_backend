var mongoose = require('mongoose');

module.exports = mongoose.model('Messagee',{
    msg: String,
    // user: {type: mongoose.Schema.ObjectId, ref: 'User'}
	created_at: {type: Date, default: Date.now}
});
