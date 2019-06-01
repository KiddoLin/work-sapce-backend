import passport from 'passport';
import localStrategy from './local';

export default function configPassport(config) {

    console.log('Express - Passport init....');
    // serialize session
    passport.serializeUser((user, done) => done(null, user));
    // deserialize session
    passport.deserializeUser((user, done) => done(null, user));
    
    passport.use(localStrategy(config));

    //passport.use(wechatStrategy(config));

    return passport;
}