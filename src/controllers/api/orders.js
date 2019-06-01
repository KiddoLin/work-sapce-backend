
export function list(req, res) {
	let { pageSize, page, order_type, category, status, source, keyword } = req.query;

	pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);
    
    let where = {};
    if(order_type && order_type!==''){
        where.order_type = order_type;
    }
    if(category && category!==''){
    	where.category = category;
    }
    if(status && status!==''){
        where.status = status;
    }
    if(source && source!==''){
        where.source = source;
    }
    if(keyword && keyword!==''){
        keyword = keyword.trim();
    	where['$or'] = {
    		booking_name: {$like: `%${keyword}%`},//数据量不大,暂时这样用
    		space_name: {$like: `%${keyword}%`} //数据量不大,暂时这样用
        }
    }
    
    const criteria = { where: where, offset: (page-1)*pageSize, limit: pageSize, order: [['id', 'DESC']]};

    console.log('criteria: ', criteria);

    const Order = req.app.models.Order;
    Order.findAndCountAll(criteria)
         .then(function({count, rows}) {
         res.json({success: true, total: count, data: rows});
    });
}

export function get(req, res) {
	const id = req.params.id;
    const Order = req.app.models.Order;
    Order.findById(id).then((item)=>{
        if(!item){
        	res.json({success: false, message:'记录不存在'});
        	return;
        }
        res.json({success: true, data: item});
    });
}