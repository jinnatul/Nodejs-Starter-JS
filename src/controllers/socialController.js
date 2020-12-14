import '../../config/ImportEnv';
import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as GithubStrategy } from 'passport-github2';
import { Strategy as LinkedinStrategy } from 'passport-linkedin-oauth2';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User';
import {
  createJWT,
} from '../middlewares/jwtToken';

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
          name: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.photos[0].value.replace('=s96-c', ''),
          active: true,
        };
        let userInfo = await User.findOne({ email: user.email });
        if (!userInfo) {
          userInfo = await User.create(user);
        } else {
          userInfo.name = user.name;
          userInfo.picture = user.picture;
        }
        userInfo._doc.token = createJWT(userInfo._id);
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
          name: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.photos[0].value,
          active: true,
        };
        let userInfo = await User.findOne({ email: user.email });
        if (!userInfo) {
          userInfo = await User.create(user);
        } else {
          userInfo.name = user.name;
          userInfo.picture = user.picture;
        }
        userInfo._doc.token = createJWT(userInfo._id);
        return cb(null, userInfo);
      });
    },
  ));

  // Linkedin
  passport.use(new LinkedinStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ['r_emailaddress', 'r_liteprofile'],
    }, (token, refreshToken, profile, cb) => {
      process.nextTick(async () => {
        const user = {
          name: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.photos[3].value,
          active: true,
        };
        let userInfo = await User.findOne({ email: user.email });
        if (!userInfo) {
          userInfo = await User.create(user);
        } else {
          userInfo.name = user.name;
          userInfo.picture = user.picture;
        }
        userInfo._doc.token = createJWT(userInfo._id);
        return cb(null, userInfo);
      });
    },
  ));

  // Twitter
  passport.use(new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CLIENT_ID,
      consumerSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
      includeEmail: true,
    }, (token, refreshToken, profile, cb) => {
      process.nextTick(async () => {
        const user = {
          name: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.photos[0].value.replace('_normal', ''),
          active: true,
        };
        let userInfo = await User.findOne({ email: user.email });
        if (!userInfo) {
          userInfo = await User.create(user);
        } else {
          userInfo.name = user.name;
          userInfo.picture = user.picture;
        }
        userInfo._doc.token = createJWT(userInfo._id);
        return cb(null, userInfo);
      });
    },
  ));

  // Facebook
  passport.use(new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['email', 'displayName', 'picture.type(large)'],
    }, (accessToken, refreshToken, profile, cb) => {
      process.nextTick(async () => {
        const user = {
          name: profile.displayName,
          email: profile.emails[0].value,
          picture: profile.photos[0].value,
          active: true,
        };
        let userInfo = await User.findOne({ email: user.email });
        if (!userInfo) {
          userInfo = await User.create(user);
        } else {
          userInfo.name = user.name;
          userInfo.picture = user.picture;
        }
        userInfo._doc.token = createJWT(userInfo._id);
        return cb(null, userInfo);
      });
    },
  ));
};

export default socialAuth;
