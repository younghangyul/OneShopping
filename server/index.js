const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')

const http = require('http')
const socketio = require('socket.io')
const router = require('../server/routes/chat')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require('method-override');

const config = require("./config/key");

// const mongoose = require("mongoose");
// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true })
//   .then(() => console.log("DB connected"))
//   .catch(err => console.error(err));

const mongoose = require("mongoose");
const connect = mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use(cors())

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data

app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: false}));
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: false}));
app.use(cookieParser());
app.use(methodOverride());

app.use('/api/users', require('./routes/users'));
app.use('/api/product', require('./routes/product'));
app.use('/uploads', express.static('uploads'));

if (process.env.NODE_ENV === "production") {

  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});

const server = http.createServer(app);
const io = socketio(server);
app.use(router);
const { addUser, removeUser, getUser, getUsersInRoom } = require('./chatUsers.js');

io.on('connection', (socket) => {
  console.log('새로운 connection이 발생하였습니다.')
  socket.on('join', ({ name, room }, callback) => {
    console.log(name, room);
    const { error, user } = addUser({ id: socket.id, name, room })
    if (error) return callback(error);

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, ${user.room}에 오신것을 환영합니다.`,
    })
    socket.broadcast.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name} 님이 가입하셨습니다.`,
    })
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    })
    socket.join(user.room)


    callback();
  })
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit('message', { user: user.name, text: message })
    callback();
  })
  socket.on('disconnect', () => {
    const user = removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('message', {
        user: 'Admin',
        text: `${user.name} 님이 방을 나갔습니다.`,
      })
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      })
    }
    console.log('유저가 떠났어요.')
  })
})
// 채팅 부분
// const Port = process.env.PORT || 4000



// server.listen(Port, () => console.log(`서버가 ${Port} 에서 시작되었어요`))