import Express from 'express';
import assert  from 'assert';

import initExpress from './express';
import initSequelize from './sequelize';
import apiRouter from './controllers/api';


//Load Configration by NODE_ENV
const mode = process.env.NODE_ENV;
const config = require(`../config/${mode}.json`);
config.mode = mode;//set to config

//Create the Express App
const app = new Express();
//Set config to app
app.config = config;

//Initialize Mongodb
initSequelize(app, config);

//Initialize Express
initExpress(app, config, ()=>{
	app.use('/api/v1', apiRouter);
});


// start app
const port = config.port || 3000;
app.listen(port, (error) => {
  if (!error) {
    console.log(`###GeekSpace Admin API Server is running on port: ${port}! ###`); // eslint-disable-line
  }
});

export default app;