import express from 'express';
import apiMonitoring from 'express-status-monitor';

const app = express();

// API monitoring
app.use(apiMonitoring());

export default app;
