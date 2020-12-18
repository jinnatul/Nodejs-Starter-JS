import express from 'express';
import passport from 'passport';
import {
  smsAuthentication,
  smsVerify,
  signInWithPhone,
  emailAuthentication,
  emailVerify,
} from '../controllers/authController';

const router = express.Router();

// Google
router.get('/google',
  passport.authenticate(
    'google', {
      scope: ['profile', 'email'],
    },
  ));

router.get('/google/callback',
  passport.authenticate(
    'google', {
      successRedirect: '/api/v1/auth/success',
      failureRedirect: '/api/v1/auth/fail',
    },
  ));

// Github
router.get('/github',
  passport.authenticate('github'));

router.get('/github/callback',
  passport.authenticate(
    'github', {
      successRedirect: '/api/v1/auth/success',
      failureRedirect: '/api/v1/auth/fail',
    },
  ));

// Linkedin
router.get('/linkedin',
  passport.authenticate('linkedin'));

router.get('/linkedin/callback',
  passport.authenticate(
    'linkedin', {
      successRedirect: '/api/v1/auth/success',
      failureRedirect: '/api/v1/auth/fail',
    },
  ));

// Twitter
router.get('/twitter',
  passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate(
    'twitter', {
      successRedirect: '/api/v1/auth/success',
      failureRedirect: '/api/v1/auth/fail',
    },
  ));

// Facebook
router.get('/facebook',
  passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate(
    'facebook', {
      successRedirect: '/api/v1/auth/success',
      failureRedirect: '/api/v1/auth/fail',
    },
  ));

// Phone verification
router.post('/sms', smsAuthentication);
router.post('/sms/verify', smsVerify);
router.post('/signin', signInWithPhone);

// Email verification
router.post('/email', emailAuthentication);
router.post('/email/verify', emailVerify);

/* Social authentication */
router.get('/success', (req, res) => res.json({
  data: req.user,
}));

router.get('/fail', (req, res) => res.json({
  status: 'failed',
  message: 'Somthing Wrong !!!',
}));

export default router;
