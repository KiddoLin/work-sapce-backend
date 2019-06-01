'use strict'

import Express from 'express';
import compression from 'compression';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import session from 'express-session';
import path from 'path';

import sessionStore from './sessions';
import configPassport from './passports';

export default function initExpress(app, config, done) {
	console.log('Express init....');
    //only log error responses if in production
    const mode = config.mode;
	let logger = mode==='prod' ? morgan('combined', {skip: (req, res) => res.statusCode < 400}) : morgan('dev');
   
    //apply favicon service
    app.use(compression());
    app.use(favicon(path.resolve(__dirname, '../public/favicon.png')));
    //apply server public assets
    //app.use(Express.static(path.resolve(__dirname, '../frontend/dist')));
    //apply logger
    app.use(logger);
    //apply cookie parser
    app.use(cookieParser());
	//apply body Parser
    app.use(bodyParser.json({limit: '20mb'}));
    app.use(bodyParser.urlencoded({limit: '20mb', extended: false}));

    //apply session related    
    app.use(session({secret: 'gs!@#$%^&', 
                      name: '_sid',
                      saveUninitialized: false, // don't create session until something stored 
                      resave: false, //don't save session if unmodified 
                      store: sessionStore(session, config) //config sesion store
    }));

    //apply passport middleware
    const passport = configPassport(config.passport);
    app.use(passport.initialize());
    app.use(passport.session());

    //apply full error stack traces in development/test
    if(mode!=='prod'){
        app.use(errorHandler());
    }
    
    //apply server routers
    //app.use('/api', router);
    if(done && typeof done ==='function'){
        done();
    }
}