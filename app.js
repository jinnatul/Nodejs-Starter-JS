import express from 'express';
import passport from 'passport';
import flash from 'connect-flash';
import session from 'express-session';
import apiMonitoring from 'express-status-monitor';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import globalErrorHandler from './src/controllers/errorController';
import router from './src/routers/router';
import authConfig from './src/controllers/socialController';
import AppError from './utils/AppError';

const app = express();

// parse application/json
app.use(express.json());

app.use(fileUpload({
  useTempFiles: true,
}));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

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

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
