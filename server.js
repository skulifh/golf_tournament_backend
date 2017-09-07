var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// var Message = require('./models/message');


var auth = require('./controllers/auth');
var message = require('./controllers/message');
var checkAuthenticated = require('./services/checkAuthenticated');
var cors = require('./services/cors');

//Middleware
app.use(bodyParser.json());
app.use(cors);

//Requests
app.get('/api/message', message.get);

app.post('/api/message',checkAuthenticated, message.post);

app.post('/auth/register', auth.register);

app.post('/auth/login', auth.login);

//Connection
mongoose.connect("mongodb://localhost:27017/test", function (err, db) {
    if (!err) {
        console.log("we are connected to mongo");
    }
})

//Mongodb schemas and models
var messageSchema = mongoose.Schema({
	msg: String,
	created_at: {type: Date, default: Date.now}
})

var Message = mongoose.model('Message', messageSchema);

//SocketIO
var server = http.createServer(app);
var io = require('socket.io')(server);
io.on('connection', function (socket) {
	Message.find({}, function(err, docs){
		if(err) throw err;
		console.log('Sending old msgs!' + docs);
		socket.emit('msg', docs);
	})
    // socket.emit('msg', { msg: Message.find({}) });
    socket.on('newmsg',function(msg){
    	console.log(msg);
    	var newMsg = new Message({msg: msg});
    	// message.msg = msg;
    	// message.save();
    	newMsg.save();

    	socket.emit('msg',  [newMsg]);
    })
});

port = process.env.PORT || 5000;

server.listen(port);

// var server = app.listen(5000, function () {
//     console.log('listening on port ', server.address().port)
// }) test