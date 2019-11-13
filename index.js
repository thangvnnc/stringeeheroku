let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let fs = require('fs');
const PORT = 9876;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send("Ready!");
});

app.get('/token/create', function(req, res){
    let id = req.query.id;
    let secret = req.query.secret;
    let userId = req.query.userId;
    var token = getAccessToken(id, secret, userId);
    res.send(token);
});

app.get('/token/saveToken', function(req, res) {
    let id = req.query.id;
    let secret = req.query.secret;
    fs.writeFile("./key.data", JSON.stringify({id: id, secret: secret}), function(err) {
        if(err) {
            console.log(err);
            res.send(err);
            return;
        }
        res.send("saved!");
    });
});

app.get('/token/getToken', function (req, res) {
    fs.readFile('./key.data', function(err, data) {
        if(err) {
            console.log(err);
            res.send(err);
            return;
        }
        let key = data.toString('utf-8')
        res.send(key);
    });
});

app.listen(PORT, function(error) {
    if (error) {
        console.log(error);
        return;
    };
});

function getAccessToken(id, secret, userId) {
	var now = Math.floor(Date.now() / 1000);
	var exp = now + 3600*24;

	var header = {cty: "stringee-api;v=1"};
	var payload = {
		jti: id + "-" + now,
		iss: id,
		exp: exp,
        userId: userId,
        rest_api: true
	};

	var token = jwt.sign(payload, secret, {algorithm: 'HS256', header: header})
	return token;
}