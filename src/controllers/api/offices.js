import date from '../../utils/date';

export function list(req, res) {
	let { pageSize, page, category, status, region, rent_model, priceGte, priceLte, keyword } = req.query;

	pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);
    
    let where = {};
    if(category && category!==''){
    	where.category = category;
    }
    if(status && status!==''){
        where.status = status;
    }
    rent_model = rent_model || '0,2';
    if(rent_model=='0,2'){
        where.rent_model = {};
        where.rent_model['$in'] = [0,2];
        if(priceGte && priceGte!==''){
            if(!where.price_per_day)
                where.price_per_day = {};
            where.price_per_day['$gte'] = priceGte;
        }
        if(priceLte && priceLte!==''){
            if(!where.price_per_day)
                where.price_per_day = {};
            where.price_per_day['$lte'] = priceLte;
        }
    }
    else if(rent_model=='1,2'){
        where.rent_model = {};
        where.rent_model['$in'] = [1,2];
        if(priceGte && priceGte!==''){
            if(!where.price_per_month)
                where.price_per_month = {};
            where.price_per_month['$gte'] = priceGte;
        }
        if(priceLte && priceLte!==''){
            if(!where.price_per_month)
                where.price_per_month = {};
            where.price_per_month['$lte'] = priceLte;
        }
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

    const {Office, Space} = req.app.models;
    
    const criteria = { where: where, offset: (page-1)*pageSize, limit: pageSize, order: [['id', 'DESC']]};
    criteria.include = {model: Space, as: 'space', attributes:['name','province','city','district']};

    // if(select && select!==''){
    // 	criteria.attributes = select.split(',');
    // }
    console.log('criteria: ', criteria);

    
    Office.findAndCountAll(criteria)
         .then(function({count, rows}) {
         //console.log(result.count);
         //console.log(result.rows);
         res.json({success: true, total: count, data: rows});
    });
}

export function get(req, res) {
	const id = req.params.id;
    const {Office, Space} = req.app.models;
    const include = {model: Space, as: 'space', attributes:['name','province','city','district']};
    Office.findById(id, {include}).then((item)=>{
        if(!item){
        	res.json({success: false, message:'记录不存在'});
        	return;
        }
        res.json({success: true, data: item});
    });
}

export function create(req, res){
	const office = req.body;
    const {space_id, name, category, rent_model, price_per_day, price_per_month, dates_excluded} = office;
	if(!name || name.trim()===''){
		res.json({success: false, message: 'name参数不能为空'});
		return;
	}

    if(rent_model==0 && typeof price_per_day!=='number'){
        res.json({success: false, message: '日租模式, price_per_day参数不能为空'});
        return;
    }
    if(rent_model==1 && typeof price_per_month!=='number'){
        res.json({success: false, message: '月租模式, price_per_month参数不能为空'});
        return;
    }
    if(rent_model==2 && typeof price_per_day!=='number' && typeof price_per_month!=='number'){
        res.json({success: false, message: '日租+月租模式, price_per_day, price_per_month参数不能为空'});
        return;
    }

    office.tags = Array.isArray(office.tags) ? office.tags.join(',') : '';
	office.picture = office.picture.map((pic) => pic.url).join('\n');
    if(Array.isArray(dates_excluded)){
       office.dates_excluded = JSON.stringify(dates_excluded);
    }
    office.created_at = new Date();
    console.log('Create Office: ', office);
    
    const Office = req.app.models.Office;
    Office.create(office).then(()=>{
        res.json({success: true});
    });
}

export function update(req, res){
	const {id} = req.params;
	const office = req.body;
    const {space_id, name, category, rent_model, price_per_day, price_per_month, dates_excluded} = office;
	if(!name || name.trim()===''){
		res.json({success: false, message: 'name参数不能为空'});
		return;
	}

    if(rent_model==0 && typeof price_per_day!=='number'){
        res.json({success: false, message: '日租模式, price_per_day参数不能为空'});
        return;
    }
    if(rent_model==1 && typeof price_per_month!=='number'){
        res.json({success: false, message: '月租模式, price_per_month参数不能为空'});
        return;
    }
    if(rent_model==2 && typeof price_per_day!=='number' && typeof price_per_month!=='number'){
        res.json({success: false, message: '日租+月租模式, price_per_day, price_per_month参数不能为空'});
        return;
    }
 
    office.tags = Array.isArray(office.tags) ? office.tags.join(',') : '';
    office.picture = office.picture.map((pic) => pic.url).join('\n');
    if(Array.isArray(dates_excluded)){
       office.dates_excluded = JSON.stringify(dates_excluded);
    }
    
    const Office = req.app.models.Office;
    Office.update(office, {where: {id: id}}).then(()=>{
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
    const Office = req.app.models.Office;
    Office.update(data,{ where: {id: id}}).then((result)=>{
    	console.log('PATCH >', result);
        return res.json({success: true, data: data});
    });
}

export function remove(req, res){
    const { id } = req.params;
    
    const {Office, Order} = req.app.models;

    Office.findById(id, {attributes: ['id','status']})
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
                Order.count({where: {office_id: id}})
            ])
            .then(result => {
                if(result[0]>0){
                    res.json({success: false, message: '已有关联的订单,不能被删除'});
                    return;
                }

                Office.destroy({where: {id}}).then((rows) => {
                    res.json({success: true});
                });
            })
            .catch(err => {
                console.log(err);
                res.json({success: false, message: '删除失败'});
            })
    });
}

