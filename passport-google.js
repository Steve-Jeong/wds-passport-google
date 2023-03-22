const GoogleStrategy = require('passport-google-oauth2').Strategy

function initializeGooglePassport(passport, users) {
  const authenticateCB = async (request, accessToken, refreshToken, profile, done) => {
    console.log('google verify CB request : ', request);
    console.log('google verify CB accessToken : ', accessToken);
    console.log('google verify CB refreshToken : ', refreshToken);
    console.log('google verify CB profile : ', profile);
    const user = {
      id: Date.now().toString(),
      name: profile.displayName,
      email: profile.email,
      password: '',
      something: 'new'
    }
    users.push(user)
    done(null, user)
  }

  const googleCredentials = require('./config/google.json')
  console.log(googleCredentials)
  passport.use(new GoogleStrategy({
    clientID : googleCredentials.web.client_id,
    clientSecret : googleCredentials.web.client_secret,
    callbackURL : googleCredentials.web.redirect_uris[0],
  }, authenticateCB))
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

module.exports = initializeGooglePassport