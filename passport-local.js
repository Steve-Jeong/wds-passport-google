const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initializePassport(passport, users) {
  const authenticateCB = async (email, password, done) => {
    // console.log('authenticateCB : ', email, ' ', password);
    const user = users.find(user => user.email === email)
    console.log('authenticateCB : user = ', user)
    if(user == null) {
      console.log('no user by that email');
      return done(null, false, {message : 'no user by that email'})
    } 
    try {
      if(await bcrypt.compare(password, user.password)) {
        console.log('successfully logged in');
        return done(null, user)
      } else {
        console.log('password incorrect')
        return done(null, false, {message : 'password incorrect'})
      }
    } catch(err) {
      console.log('catch error', err)
      return done(err);
    }
  }
  passport.use(new LocalStrategy({usernameField:'email'}, authenticateCB))
  passport.serializeUser((user, done) => {
    console.log('serialize user id : ', user.id)
    return done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    const user = users.find(user => user.id === id)
    console.log('deserializeUser : ', user)
    return done(null, user)
  })

}

module.exports = initializePassport
