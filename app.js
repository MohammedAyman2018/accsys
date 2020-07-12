var createError = require('http-errors')
var express = require('express')
var path = require('path')
var logger = require('morgan')

var bodyParser = require('body-parser')

var mongoose = require('mongoose')

const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
// var cors = require('cors')
require('dotenv').config()

// var index = require('./routes/index');
var usersRouter = require('./routes/user')
var cosmaticsRouter = require('./routes/cosmatics')
var makupRouter = require('./routes/makup')
var medicalRouter = require('./routes/medical')
var papersRouter = require('./routes/papers')
var othersRouter = require('./routes/others')
var orderRouter = require('./routes/order')

var app = express()

var http = require('http').createServer(app)
var io = require('socket.io')(http)

const EventEmitter = require('events')
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter()

io.on('connection', (socket) => {
  console.log('HI IM CONNECTED')
  socket.on('dbchanged', (data) => {
    socket.emit('yapa', 'hello ya LOL')
  })
})

/** Connect to db */
async function db () {
  /**
   *    process.env.db
   *  "mongodb://localhost:27017/system_accountant"
   */
  await mongoose.connect(process.env.db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
    .then(() => console.log('connected to the db'))
    .catch((err) => console.log(err))

  const conn = await mongoose.createConnection(process.env.db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  conn.watch().on('change', data => {
    // Dispatch the event.
    myEmitter.emit('dbchanged')
  })
};
db()

// security
app.use(mongoSanitize())
app.use(xss())
app.use(helmet())
// var corsOptions = {
//   origin: 'https://accsys.herokuapp.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// app.use(cors(corsOptions));

app.use(bodyParser.json({ extended: false }))
app.use(bodyParser.urlencoded({ extended: false }))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// app.use('/', index);
app.use('/cosmatics', cosmaticsRouter)
app.use('/makeup', makupRouter)
app.use('/medical', medicalRouter)
app.use('/papers', papersRouter)
app.use('/others', othersRouter)
app.use('/users', usersRouter)
app.use('/orders', orderRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

const port = process.env.PORT || 3000

http.listen(port, () => {
  console.log('listening on *:3000')
})
