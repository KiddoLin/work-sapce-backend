import Sequelize from 'sequelize';
import assert  from 'assert';
import fs from "fs";
import path from 'path';

export default function initSequelize(app, config, done){
	console.log('Sequelize init....');
    assert(config.db, 'Not found "db" in config file');
    const {database, username, password, options} = config.db;

    const sequelize = new Sequelize(database, username, password, options);
    const models_dir = __dirname + '/models/'
    
    const models = {};//assign to app context 
    fs.readdirSync(models_dir).forEach((file) => {
      
        if (~file.indexOf('.js')){
            let model = sequelize.import(path.join(models_dir, file));

            models[model.name] = model;
            console.log('Load Sequelize Model file: %s ...', file);
        }
    });

    for(let name in models){
        if("associate" in models[name]){
            models[name].associate(models);
        }
    }
    app.models = models;
    app.sequelize = sequelize;
    if(done && typeof done ==='function'){
        done(sequelize);
    }
}