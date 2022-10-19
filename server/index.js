const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require('method-override');
app.use(cors())

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*"
  }
});
const config = require("./config/key");

// const mongoose = require("mongoose");
// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true })
//   .then(() => console.log("DB connected"))
//   .catch(err => console.error(err));

const { Chat } = require('./models/Chat');
const { auth } = require("./middleware/auth");

const mongoose = require("mongoose");
const connect = mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

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
app.use('/api/chat', require('./routes/chat'));
app.use('/api/product', require('./routes/product'));
app.use('/uploads', express.static('uploads'));

const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
  // fileFilter: (req, file, cb) => {
  //   const ext = path.extname(file.originalname)
  //   if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
  //     return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
  //   }
  //   cb(null, true);
  // }
})

const upload = multer({ storage: storage }).single('file');

app.post("/api/chat/uploadfiles", auth, (req, res) => {
  upload(req, res, err => {
    if(err) { return res.json({ success: false, err }) }
    return res.json({ success: true, url: res.req.file.path });
  });
});

io.on('connection', socket => {
  socket.on('Input Chat Message', msg => {
    connect.then(db => {
      try {
          let chat = new Chat({ message: msg.chatMessage, sender: msg.userId, type: msg.type })
          
          chat.save((err, doc) => {
            if(err) return res.json({ success: false, err})

            Chat.find({ "_id": doc._id })
            .populate('sender')
            .exec((err, doc) => {

                return io.emit('Output Chat Message', doc);
            })
          })
      } catch (error) {
        console.error(error);
      }
    })
  })
})

if (process.env.NODE_ENV === "production") {

  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000

server.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});

