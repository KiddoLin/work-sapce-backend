import assert  from 'assert';
import initSequelize from '../sequelize';
import schedule from 'node-schedule';

import MapStatJob from './mapstat';

//Load Configration by NODE_ENV
const mode = process.env.NODE_ENV;
const config = require(`../../config/${mode}.json`);
config.mode = mode;//set to config

//Create the Express App
const app = {};
//Set config to app
app.config = config;

//Initialize Mongodb
assert(config.db, 'Not found "db" in config file');
initSequelize(app, config);

//Initialize Schedule Tasks
schedule.scheduleJob("*/1 * * * *", new MapStatJob(app, schedule).doJob);
console.log('Scheduled MapStatJob...');
//new MapStatJob(app, schedule).doJob();