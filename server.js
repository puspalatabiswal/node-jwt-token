var express = require ("express");
var app = express();
var router = express.Router();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var morgan = require("morgan");


//for internal files
var config = require("./config");
var User = require("./models/user");



app.use(morgan('dev'));
app.set('secretkey',config.SECRET); // to set the key
console.log(app.get('secretkey')); //to get the key value

app.use(bodyParser.json());
app.use(bodyParser.urlencoded ({extended : true}))


mongoose.connect(config.DATABASECON,function(){
	console.log("db connected successfully...");
})





//getting the data
router.get("/" , function(req,res){
	res.send("this is my jwt authentication app");
})

//puuting the data
router.post("/createUser", function(req,res){
var userObj = req.body;
console.log("hii");
User.createUser(userObj,function(err , data){
	if(err){
		throw err;
	}
	res.json(data);
});

})

//to get the details by specific user name 
router.get("/getUser/:name",function(req,res){

var userName = req.params.name;
User.getUserByName(userName,function(err,data){
	if(err){
		throw err;
	}
	res.json(data);
});
})



//for authentication
router.post("/authenticate" , function(req,res){
var username = req.body.name;
var password = req.body.password;
User.getUserByName(username , function(err,user){
	if(err){
		throw err;
	}

	if(!user){
res.json({success : false,
          message : "authentication failed , user not found"
        })
	}
	else if(user)
	{
if(user.password != password ){
	res.json({
		success : false,
		message : "authentication failed , password not matched"
	})
	}
else{
var token = jwt.sign(user , app.get('secretkey'))
res.json({
	success : true,
	message : "here is your token",
	token : token
})
}

}

});
})


router.use(function(req,res,next){
	var token = req.body.token || req.query.token || req.headers["x-access-token"];
	if(token){
		jwt.verify(token ,app.get('secretkey'),function(err,decoded){
			if(err){
				res.json({

					success: false,
					message : "authentication failed , not a valid token "
				})

			}
			else{
				req.decoded = decoded;
				next();

		}	
	 })
    }
	else{
		res.status(403).send({
			success : false,
			message : "please provide"
		})

	}
});

//to get the all user details
router.get("/getUsers",function(req,res){


User.getUsers(function(err,data){
	if(err){
		throw err;
	}
	res.json(data);
});
})

app.use("/api" , router);
var PORT = process.env.PORT || 1337 ;
app.listen(PORT,function(){
	console.log("Port is " , PORT);
})

