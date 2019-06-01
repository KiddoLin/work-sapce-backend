
import qiniu from 'qiniu';

const FSIZE_LIMIT = 10*1024*1024;

export function genToken(req, res){
    
    const qnConfig = req.app.config.qiniu;
    let { bucket, bucketUrl } = qnConfig;

    let mac = new qiniu.auth.digest.Mac(qnConfig.accessKey, qnConfig.secretKey);
 
    let url = bucketUrl;
    let putPolicy = new qiniu.rs.PutPolicy(bucket);

    putPolicy.fsizeLimit = FSIZE_LIMIT;
    putPolicy.mimeLimit = 'image/*;';
    putPolicy.isPrefixalScope = 1;
    
    let token = putPolicy.token(mac);
    
    console.log('gen token: ' + token);
    
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);
    res.json({success: true, data: {token: token, url: url}});
}