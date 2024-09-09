import http from 'http'
import createError from 'http-errors'
import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import session from 'express-session'
import routes from './routes'
import { sequelize } from './database/models'
import path from 'path'

const app = express()
const server = http.createServer(app)

dotenv.config()

const mode = process.env.NODE_ENV || 'development'

app.use(
  session({
    secret: process.env.SECRET_KEY || 'REACH',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
  })
)

// make file accessible from public folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(logger('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

//Check DBs connection
if (mode === 'development') {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Development DB Connected!')
    })
    .catch((err) => {
      console.log('Development DB Not Connected!')
      console.log({ Error_Message: err })
    })
}

if (mode === 'production') {
  sequelize
    .authenticate()
    .then(() => {
      console.log('Production DB Connected!')
    })
    .catch((err) => {
      console.log('Production DB Not Connected!')
      console.log({ Error_Message: err })
    })
}

app.use('/', routes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.send({
    message: err.message,
    error: err.status,
  })
  next()
})

app.server = server
export default app
