import createFileStore from 'session-file-store';

export default function fileSessionStore(session, config){
	console.log('Express - SessionStore FileStore init....')
    const FileStore = createFileStore(session);
    
    return new FileStore({
            path: './cache',
            ttl: 24 * 60 * 60 //1 day for dev
    });
}