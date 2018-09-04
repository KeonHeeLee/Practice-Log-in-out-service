import WebpackDevServer from 'webpack-dev-server';
import express from 'express';
import webpack from 'webpack';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import session from 'express-session';
import api from './routes'

const devPort = 4000;
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api',api);
app.use(session({
    secret: 'CodeLab$1$1234',
    resave: false,
    saveUninitialized: true
}))

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {console.log('Connected to mongodb server');});
mongoose.connect('mongodb://localhost/codelab');

if(process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = require(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {
            console.log('webpack-dev-server is listening on port ',devPort);
        }
    );
}