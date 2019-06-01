import request from 'request'
import qs from 'querystring'
import crypto from 'crypto'

export function getMapStat(req, res){
	const {lat, lng} = req.query;
	const cfg = req.app.config.qqmap;
    
	fetchMapStat(cfg, {lat, lng}, (err, data)=>{
        if(err){
        	console.log(err);
        	res.json({success: false, message: '查询失败: ' + err});
        	return;
        }

        res.json({success: true, data: data});
	});
}

export function fetchMapStat(cfg, latlng, callback){
	console.log(cfg);
    Promise
        .all([
        	getNearbyCount(cfg, latlng, '交通设施'),
        	getNearbyCount(cfg, latlng, '银行'),
        	getNearbyCount(cfg, latlng, '美食'),
        	getNearbyCount(cfg, latlng, '酒店宾馆'),
        ])
        .then(result => {
            const data = {
            	transport: result[0],
            	bank: result[1],
            	restaurant: result[2],
            	hotel: result[3]
            }
            callback(null, data);
        })
        .catch(err => {
            callback(err);
        });
}

function getNearbyCount(cfg, latlng, keyword){
   const {key, secret, placeApiUrl, distance} = cfg;
   const {lat, lng} = latlng;
   const boundary = `nearby(${lat},${lng},${distance})`;
   const page_size=1, page_index = 1;
   const orderby = '_distance';
   let query = {boundary, page_size, page_index, keyword, orderby, key};
   const sn = caculateSN('/ws/place/v1/search', secret, query);
   query.sn = sn;

   let queryStr = qs.stringify(query);
   let url = placeApiUrl + '?' + queryStr;
   console.log('GET ' + url);
   return new Promise((resolve,reject)=>{
        request(url, (error, res, body)=>{
         	if(!error && res.statusCode == 200){
         		console.log(body);
         		const result = JSON.parse(body);
         		const {status, message, count} = result;
         		if(status===0){
         		   resolve(count);
         		}
         		else{
         			reject(message);
         		}
         	}
         	else{
         		reject(error || 'Error, Http Status Code: ' + res.statusCode);
         	}
        })
   });
}

function caculateSN(uri, secret, query){
	// let sortedQuery = {};
	// console.log(query);
 //    for (let key of Object.keys(query).sort()) {
 //        sortedQuery[key] = query[key];
 //    }
 //    console.log(sortedQuery);

    const queryStr = qs.stringify(query, '&', '=', {encodeURIComponent: (str) => str});
    let rawStr = uri + '?' + queryStr + secret;
    console.log('RawStr: ' + rawStr);
    rawStr = encodeURI(rawStr);
    //rawStr = '%2Fws%2Fplace%2Fv1%2Fsearch%3Fboundary%3Dnearby%2839.908491%2C116.374328%2C1000%29%26page_size%3D1%26page_index%3D1%26keyword%3D%E4%BA%A4%E9%80%9A%E8%AE%BE%E6%96%BD%26orderby%3D_distance%26key%3D4FNBZ-DHQHO-ICUW6-SA7NR-YG62T-B3F6KkhAYXqmbS3xq39zbpuZeVcclV1lCjzD0'
    console.log('URLEncoded: ' + rawStr);
    const sn = crypto.createHash('md5').update(rawStr).digest('hex');

    console.log('SN: ' + sn);

    return sn;
}