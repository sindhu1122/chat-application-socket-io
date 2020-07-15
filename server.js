const io = require('socket.io')(3000)
var redis = require('redis');
var client = redis.createClient();
client.on('connect', function () {
  console.log('connected');
});
const users = {}
const c = {}
io.on('connection', socket => {
  socket.on('new-user', name => {
    client.hgetall('id', function (err, reply) {
      c[socket.id] = name
      client.hmset('id', c, function (err, repl) {
      });
    })
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    client.hgetall('id', function (err, reply) {

      socket.broadcast.emit('chat-message', { message: message, name: reply[socket.id] })
    });

  })
  socket.on('disconnect', () => {
    client.hgetall('id', function (err, reply) {
      socket.broadcast.emit('user-disconnected', reply[socket.id])
    });
    client.del('id', function (err, reply) {
    });
  })
})