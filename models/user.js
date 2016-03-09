
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	id: String,
	username: String,
	password: String,
	address: String,
	birthdate: String,
	contact: String,
	email: String,
	fullname: String,
	oldUserId: String,
	avatar: String
});
