import '../../config/ImportEnv';
import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as LinkedinStrategy } from 'passport-linkedin-oauth2';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import User from '../models/User';

const socialAuth = () => {
  // used to serialize the user for the session
  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  // used to deserialize the user
  passport.deserializeUser((user, cb) => {
    cb(null, user);
  });

  // Goggle
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    }, (token, refreshToken, profile, cb) => {
      process.nextTick(async () => {
        const user = {
          name: profile._json.name,
          email: profile._json.email,
          picture: profile._json.picture.replace('=s96-c', ''),
          active: true,
        };
        let userInfo = await User.findOne({ email: user.email });
        if (!userInfo) {
          userInfo = await User.create(user);
        }
        return cb(null, userInfo);
      });
    },
  ));

  // Github
  passport.use(new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    }, (token, refreshToken, profile, cb) => {
      process.nextTick(async () => {
        const user = {
          name: profile._json.name,
          email: profile.emails[0].value,
          picture: profile._json.avatar_url,
          active: true,
        };
        let userInfo = await User.findOne({ email: user.email });
        if (!userInfo) {
          userInfo = await User.create(user);
        }
        return cb(null, userInfo);
      });
    },
  ));
};

export default socialAuth;
