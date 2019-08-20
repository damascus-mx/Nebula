// Required libs
import express from 'express';
import compression  from 'compression';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import * as rfs from 'rotating-file-stream';
import * as fs from 'fs';
import * as path from 'path';
import lusca from "lusca";
import passport from "passport";

// Custom libs
import * as passportConfig from '../common/config/passport.config';

// Const
const app = express();
const API_ROUTE = '/api/v1';

// Routes import
import { UserRoutes } from '../routes/user.routes';

// Gzip compression
app.use(compression());

// Parser to JSON
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Config logger
const logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs.default(
    'access.log', {
        interval: '5d',
        path: logDirectory
    }
);
app.use(morgan("combined", { stream: accessLogStream }));

// Passport Auth
app.use(passport.initialize());
passportConfig.default();

// LUSCA
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

// CORS
// TODO - Change public policy to AWS Cloudfront/VPC
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
    res.header('Allow', 'GET, POST, DELETE, PUT, OPTIONS');

    next();
});

// Routes
app.use(API_ROUTE, UserRoutes);

export default app;