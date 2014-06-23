//aap.js is main file
//author: Abhijeet Mahavarkar
//last edited: june 24, 1.30am

var express = require('express'),
	app = express();

var ejs = require('ejs');

var port = 3000;

var http = require('http'),
	server = http.Server(app),
	io = require('socket.io').listen(server);

server.listen(port);

console.log("server is listening on "+ port);


//set views and public static folders

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
	response.render('index');
});

var users = {};

io.sockets.on('connection', function(socket) {

	console.log("socket connected");

	function updateNicknames() {
		io.sockets.emit('usernames', Object.keys(users));
	}

	socket.on('newUser', function(data, callback) {
		if(data in users) {
			callback(false);
		}
		else {
			callback(true);
			socket.nickname=data;
			users[socket.nickname]=socket;
			updateNicknames();
		}
	});

	socket.on('partnerSelection', function(data, callback) {
		if(data in users && socket.nickname != data) {
			callback(true);
			socket.partnerSocket= users[data];
		}
		else {
			callback(false);
		}
	});

	socket.on('sendNewMessage', function(data) {
		socket.partnerSocket.emit('receiveNewMessage', { msg: data, nick: socket.nickname });
	});

	socket.on('disconnect', function(data) {
		if(!socket.nickname) return;
		delete users[socket.nickname];
		updateNicknames();
	});

});