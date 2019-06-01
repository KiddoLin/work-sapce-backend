import date from '../../utils/date';

export function list(req, res) {
	let { pageSize, page, type, status, scene, keyword } = req.query;

	pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);
    
    let where = {};
    if(type && type!==''){
    	where.type = type;
    }
    if(status && status!==''){
        where.status = status;
    }
    if(scene && scene!==''){
        where.scene = {$like: `%${scene}%`};
    }
    if(keyword && keyword!==''){
        keyword = keyword.trim();
    	where['$or'] = {
    		username:  {$like: `%${keyword}%`},
            telephone: {$like: `%${keyword}%`},
            '$space.name$': {$like: `%${keyword}%`}
        }
    }

    const {User, Space} = req.app.models;
    
    const criteria = { where: where, offset: (page-1)*pageSize, limit: pageSize, order: [['id', 'DESC']]};
    criteria.include = {model: Space, as: 'space', attributes:['name']};

    // if(select && select!==''){
    // 	criteria.attributes = select.split(',');
    // }
    console.log('criteria: ', criteria);

    
    User.findAndCountAll(criteria)
         .then(function({count, rows}) {
         //console.log(result.count);
         //console.log(result.rows);
         res.json({success: true, total: count, data: rows});
    });
}

export function get(req, res) {
	const id = req.params.id;
    const {User, Space} = req.app.models;
    const include = {model: Space, as: 'space', attributes:['name']};
    User.findById(id, {include}).then((item)=>{
        if(!item){
        	res.json({success: false, message:'记录不存在'});
        	return;
        }
        //const {industry, pictures, facilities} = item;
        //item.industry = industry.split(',');
        //item.pictures = pictures.split('\n').map((url,uid) => { return {url, uid}; });
        //item.facilities = JSON.parse(facilities);
        res.json({success: true, data: item});
    });
}

// export function create(req, res){
// 	const office = req.body;
// 	if(!office.name || office.name===''){
// 		res.json({success: false, message: 'name参数不能为空'});
// 		return;
// 	}

// 	//let {industry, pictures, facilities} = office;
// 	// space.industry = industry ? industry.join(',') : '';
// 	// space.pictures = pictures.map((pic) => pic.url).join('\n');
// 	// space.facilities = JSON.stringify(facilities);

//     const Office = req.app.models.Office;
//     office.created_at = new Date();
    
//     console.log('Create Office: ', office);
//     Office.create(office).then(()=>{
//         res.json({success: true});
//     });
// }

// export function update(req, res){
// 	const {id} = req.params;
// 	const office = req.body;
// 	if(!office.name || office.name===''){
// 		res.json({success: false, message: 'name参数不能为空'});
// 		return;
// 	}
 
// 	//let {industry, pictures, facilities} = space;
// 	//space.industry = industry ? industry.join(',') : '';
// 	//space.pictures = pictures.map((pic) => pic.url).join('\n');
// 	//space.facilities = JSON.stringify(facilities);
//     office.updated_at = new Date();
    
//     const Office = req.app.models.Office;
//     Office.update(office, {where: {id: id}}).then(()=>{
//         res.json({success: true});
//     });
// }

export function patch(req, res){
	const { id } = req.params
    const {nextStatus, space_id} = req.body;
    let data = {};
    if(nextStatus===undefined && space_id===undefined){
        res.json({success: false, message: '参数不能为空'});
        return;
    }
    if(nextStatus!==undefined){
        if(nextStatus!=0 && nextStatus!=1){
            res.json({success: false, message: 'nextStatus参数不合法'});
            return;
        }
        data.status = parseInt(nextStatus);
    }

    if(space_id!==undefined && space_id!==''){
        data.space_id = parseInt(space_id);
        data.type = data.space_id===0 ? 0 : 1;
    }
    //data.updated_at =
    //const data = {status: nextStatus, updated_at: new Date().format('yyyy-MM-dd hh:mm:ss')}
    const User = req.app.models.User;
    User.update(data,{ where: {id: id}}).then((result)=>{
    	console.log('PATCH >', result);
        return res.json({success: true, data: data});
    });
}

