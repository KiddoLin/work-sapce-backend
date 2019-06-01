import LocalStrategy from 'passport-local';
//import User from '../models/user';

/**
 * [configLocalStrategy description]
 * @param  {[type]}  config    [description]
 * @return {[type]}            [description]
 */
export default function createStrategy(config) {
    console.log('Passport LocalStrategy init....');

    // use local strategy
    return new LocalStrategy.Strategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        (username, password, done) => { //doLogin
            //console.log('username: ' + username);
            //console.log('password: ' + password);
            // User.findOne({ email: username.toLowerCase() }, (err, user) => {
            //     if (err) {
            //         return done(err);
            //     }
            //     //console.log(user);
            //     if (!user || !user.comparePassword(password)) {
            //         return done(null, null, { success: false, message: '用户名或密码错误' });
            //     }
            //     return done(null, user);
            // });
            const users = require('../../config/admin_users.json');
            const user = users[username];
            if(!user || user.password!==password){
                return done(null, null, { success: false, message: '用户名或密码错误' });
            }

            return done(null, Object.assign({}, user));
        }
    );
};