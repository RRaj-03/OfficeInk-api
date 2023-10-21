require('dotenv').config();
const LinkedInStrategy = require("passport-linkedin-oauth2").Strategy;
const passport = require("passport");

passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
});
  
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: '/auth/linkedin/callback',
        scope: ['openid', 'profile', 'email'],
        state: true,
      },
      function (req, accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        req.session.accessToken = accessToken;
        process.nextTick(function () {
          // To keep the example simple, the user's Linkedin profile is returned to
          // represent the logged-in user.  In a typical application, you would want
          // to associate the Linkedin account with a user record in your database,
          // and return that user instead.
          return done(null, profile);
        });
      }
    )
  );

