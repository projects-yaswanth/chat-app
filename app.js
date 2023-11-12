const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const userRouter = require('./Routes/userRoutes');
const viewsRouter = require('./Routes/viewsRouter');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(morgan('dev'));

app.use('/api', userRouter);
app.use('/', viewsRouter);

module.exports = app;
