import date from '../../utils/date';

export function list(req, res) {
	let { pageSize, page, category, status, region, priceGte, priceLte, capacityGte, capacityLte, keyword } = req.query;

	pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);
    
    let where = {};
    if(category && category!==''){
    	where.category = category;
    }
    if(status && status!==''){
        where.status = status;
    }
    if(priceGte && priceGte!==''){
        if(!where.price_per_hour)
            where.price_per_hour = {};
        where.price_per_hour['$gte'] = priceGte;
    }
    if(priceLte && priceLte!==''){
        if(!where.price_per_hour)
            where.price_per_hour = {};
        where.price_per_hour['$lte'] = priceLte;
    }
    if(capacityGte && capacityGte!==''){
        if(!where.capacity)
            where.capacity = {};
        where.capacity['$gte'] = capacityGte;
    }
    if(capacityLte && capacityLte!==''){
        if(!where.capacity)
            where.capacity = {};
        where.capacity['$lte'] = capacityLte;
    }
    if(region && region!==''){
        let r = region.split(',');
        where['$space.province$'] = r[0];
        if(r.length>=2 && r[1]!=='*'){
            where['$space.city$'] = r[1];
        }
        if(r.length>=3 && r[2]!=='*'){
            where['$space.district$'] = r[2];
        }
    }
    if(keyword && keyword!==''){
        keyword = keyword.trim();
    	where['$or'] = {
    		name: {$like: `%${keyword}%`},
            '$space.name$': {$like: `%${keyword}%`}
        }
    }

    const {Meetingroom, Space} = req.app.models;
    
    const criteria = { where: where, offset: (page-1)*pageSize, limit: pageSize, order: [['id', 'DESC']]};
    criteria.include = {model: Space, as: 'space', attributes:['name','province','city','district']};

    // if(select && select!==''){
    // 	criteria.attributes = select.split(',');
    // }
    console.log('criteria: ', criteria);

    
    Meetingroom.findAndCountAll(criteria)
         .then(function({count, rows}) {
         //console.log(result.count);
         //console.log(result.rows);
         res.json({success: true, total: count, data: rows});
    });
}

export function get(req, res) {
	const id = req.params.id;
    const {Meetingroom, Space} = req.app.models;
    const include = {model: Space, as: 'space', attributes:['name','province','city','district']};
    Meetingroom.findById(id, {include}).then((item)=>{
        if(!item){
        	res.json({success: false, message:'记录不存在'});
        	return;
        }
        res.json({success: true, data: item});
    });
}

export function create(req, res){
	const meetingroom = req.body;
	if(!meetingroom.name || meetingroom.name===''){
		res.json({success: false, message: 'name参数不能为空'});
		return;
	}

    meetingroom.tags = Array.isArray(meetingroom.tags) ? meetingroom.tags.join(',') : '';
	meetingroom.picture = meetingroom.picture.map((pic) => pic.url).join('\n');
    meetingroom.dates_excluded = JSON.stringify(meetingroom.dates_excluded);
    meetingroom.created_at = new Date();

    const Meetingroom = req.app.models.Meetingroom;
    console.log('Create Meetingroom: ', meetingroom);
    Meetingroom.create(meetingroom).then(()=>{
        res.json({success: true});
    });
}

export function update(req, res){
	const {id} = req.params;
	const meetingroom = req.body;
	if(!meetingroom.name || meetingroom.name===''){
		res.json({success: false, message: 'name参数不能为空'});
		return;
	}
 
    meetingroom.tags = Array.isArray(meetingroom.tags) ? meetingroom.tags.join(',') : '';
    meetingroom.picture = meetingroom.picture.map((pic) => pic.url).join('\n');
    meetingroom.dates_excluded = JSON.stringify(meetingroom.dates_excluded);
    //meetingroom.updated_at = new Date();
    
    const Meetingroom = req.app.models.Meetingroom;
    Meetingroom.update(meetingroom, {where: {id: id}}).then(()=>{
        res.json({success: true});
    });
}

export function patch(req, res){
	const { id } = req.params
    const {nextStatus} = req.body
    console.log(!nextStatus);
    if(nextStatus===undefined || nextStatus===''){
		res.json({success: false, message: 'nextStatus参数不能为空'});
		return;
	}
    const data = {status: nextStatus}
    if(nextStatus===1){
        data.updated_at = new Date().format('yyyy-MM-dd hh:mm:ss')
    }
    else
        data.updated_at = null;

    const Meetingroom = req.app.models.Meetingroom;
    Meetingroom.update(data,{ where: {id: id}}).then((result)=>{
    	console.log('PATCH >', result);
        return res.json({success: true, data: data});
    });
}

export function remove(req, res){
    const { id } = req.params;
    
    const {Meetingroom, Order} = req.app.models;

    Meetingroom.findById(id, {attributes: ['id','status']})
        .then((item) =>{
            if(!item){
                res.json({success: true});
                return;
            }
            if(item.status===1){
                res.json({success: false, message: '已上架状态,不能被删除！'});
                return;
            }

            Promise.all([ 
                Order.count({where: {meetingroom_id: id}})
            ])
            .then(result => {
                if(result[0]>0){
                    res.json({success: false, message: '已有关联的订单,不能被删除'});
                    return;
                }

                Meetingroom.destroy({where: {id}}).then((rows) => {
                    res.json({success: true});
                });
            })
            .catch(err => {
                console.log(err);
                res.json({success: false, message: '删除失败'});
            })
    });
}

