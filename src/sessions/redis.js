import createRedisStore from 'connect-redis';

export default function redisSessionStore(session, config){
	console.log('Express - SessionStore RedisStore init....')
    const RedisStore = createRedisStore(session);
    const {host, port} = config.redis;
    return new RedisStore({host, port});
}