const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route');

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);
module.exports = app;