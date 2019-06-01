import fileSessionStore from './file';
//import redisSessionStore from './redis';

export default function sessionStore (session, config){
    return fileSessionStore(session, config);
}