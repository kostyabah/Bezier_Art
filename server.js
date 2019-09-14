var express = require("express"),
	multer = require('multer'),
	fs = require("fs"),
	upload = multer(),
	path = require('path'),
	app = express();

app.use(express.static(__dirname + "/"));
console.log(__dirname);
app.get("/", function (req, res) {
	console.log("hello")
	res.sendFile("index.html");
});
/*
app.post("/upload", upload.array(), function(req, res){
	
	console.log(req.body.name);
	console.log(req.body.image.length);
	var name = req.body.name;
	var data = req.body.image.replace(/^data:image\/png;base64,/, "");
	console.log("--------------------");
	//console.log(data);
	//var buffer = decodeImage(req.body.image).data;
	fs.open(`img/rgb_#${name}.png`, "w+", 0644,function(err, body){
		if(err){
			console.log("create error");
			return;
		} 
		fs.writeFile(`img/rgb_#${name}.png`, data, "base64", function(err, suc){
			if(err){
				res.send(err);
			console.log("write error");
		}
		else
			console.log("very good");
			res.send("img/rgb="+name);
		});
	});
	
	
});
*/
app.listen(process.env.PORT || 3000, function () {
	console.log("listen port : 3000");
})

