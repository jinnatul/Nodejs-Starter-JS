import express from 'express';
import passport from 'passport';

const router = express.Router();

/* Google */
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
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

/* Github */
// send to github to do the authentication
// profile gets us their basic information including their name
// email gets their emails
router.get('/github',
  passport.authenticate('github'));

router.get('/github/callback',
  passport.authenticate(
    'github', {
      successRedirect: '/api/v1/auth/success',
      failureRedirect: '/api/v1/auth/fail',
    },
  ));

/* Linkedin */
// send to linkedin to do the authentication
// profile gets us their basic information including their name
// email gets their emails
router.get('/linkedin',
  passport.authenticate('linkedin'));

router.get('/linkedin/callback',
  passport.authenticate(
    'linkedin', {
      successRedirect: '/api/v1/auth/success',
      failureRedirect: '/api/v1/auth/fail',
    },
  ));

/* Twitter */
// send to twitter to do the authentication
// profile gets us their basic information including their name
// email gets their emails
router.get('/twitter',
  passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate(
    'twitter', {
      successRedirect: '/api/v1/auth/success',
      failureRedirect: '/api/v1/auth/fail',
    },
  ));

router.get('/success', (req, res) => res.json({
  data: req.user,
}));

router.get('/fail', (req, res) => res.json({
  status: 'failed',
  message: 'Somthing Wrong !!!',
}));

export default router;
