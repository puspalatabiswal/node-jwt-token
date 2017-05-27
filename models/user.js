var mongoose = require ("mongoose");
var userSchema = mongoose.Schema({

	name:{
		type:String
	},
	password :{
		type:String
	},
	admin :{
			type: Boolean
	}
})

var User = module.exports = mongoose.model("user" ,userSchema ,"user" );


module.exports.createUser = function(userObj,callback){
	console.log("bye");
	return User.create(userObj, callback);
}

//to get the details by specific user name
module.exports.getUserByName = function(userName,callback){
	return User.findOne({name:userName} ,callback);
}

//to get the all user details
module.exports.getUsers= function(callback){
	return User.find(callback);
}