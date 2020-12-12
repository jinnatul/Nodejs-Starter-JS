import express from 'express';
import passport from 'passport';
import flash from 'connect-flash';
import session from 'express-session';
import apiMonitoring from 'express-status-monitor';
import router from './src/routers/router';
import authConfig from './src/controllers/socialController';

const app = express();

// API monitoring
app.use(apiMonitoring());

// allow session
app.use(session({ secret: process.env.SECRET }));

// session & cookie save through flash
app.use(flash());

// configure passport auth
app.use(passport.initialize());
app.use(passport.session());

// Social authentication configuration
authConfig();

app.use('/api/v1', router);

export default app;
