const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport = require('./passport-local')
const initializeGooglePassport = require('./passport-google')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')


const PORT = 3000

const users = [{
  id: '1666985414621',
  name: 'w',
  email: 'w@w',
  password: '$2b$10$knoh.bY8ttTwNKnHmmp40OrVyJhBl0nPy9ZT8S7YUJ8UMGe6IpG86',  // 'w'
}]

initializePassport(passport, users)
initializeGooglePassport(passport, users)

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


app.get('/', (req, res) => {
  console.log('users list :', users);
  res.render('index', { user: req.user })
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  users.push({
    id: Date.now().toString(),
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    something: 'new'
  })
  console.log(users);
  res.redirect('/login')
})

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

app.get('/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/',
        failureRedirect: '/login'
}));

app.get('/login', (req, res) => {
  const message = req.flash('error')[0]
  res.render('login', { message: message })
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.delete('/logout', (req, res) => {
  req.logOut({
    keepSessionInfo: false
  }, (err) => console.log('logout error : ', err))
  res.redirect('/')
})

app.listen(PORT, console.log('server is listening on port', PORT))