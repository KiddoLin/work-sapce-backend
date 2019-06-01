import request from 'request';

export function genQrcode(req ,res){
    const {id} = req.params;
    const params = req.query;
    const gsApi = req.app.config.gsApi;
    request.post(gsApi.getQrcodeUrl, {form: params}, (err, response, body)=>{
        if(err || response.statusCode != 200){
            console.log(err);
            res.json({success: false, message: '生成二维码失败, 请稍后重试'});
            return;
        }
        const result = JSON.parse(body);
        const {code, data, msg}= result;
        if(code!==200){
            console.log(result);
            res.json({success: false, message: '生成二维码失败, 请稍后重试'});
            return;
        }

        res.json({success: true, data: data});
    });
}