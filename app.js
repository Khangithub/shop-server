const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyPaser = require('body-parser')
const mongoose = require('mongoose')
const cookiePareser = require('cookie-parser')
const cors = require('cors')

const productRouter = require('./api/routes/products')
const orderRouter = require('./api/routes/orders')
const userRouter = require('./api/routes/user')
const commentRouter = require('./api/routes/comment')

mongoose.connect(process.env.MONGO_ATLAS_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useUnifiedTopology: false, // sau 30000ms mongo server sẽ tự động đóng
  useFindAndModify: false,
  useUnifiedTopology: true
})

mongoose.Promise = global.Promise

mongoose.connection.on('connected', () => {
  console.log('connected to mongo atlas')
})

app.use(morgan('dev'))
app.use(cookiePareser())
// app.use('/uploads', express.static('uploads'));
app.use(bodyPaser.urlencoded({ extended: false }))
app.use(bodyPaser.json())

app.use(cors({ origin: '*' }))

app.use('/products', productRouter)
app.use('/orders', orderRouter)
app.use('/users', userRouter)
app.use('/comments', commentRouter)
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app
