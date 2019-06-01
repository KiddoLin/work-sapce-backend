
export function list(req, res) {
	let { pageSize, page, status } = req.query;

	pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);
    
    let where = {};

    if(status && status.indexOf(',')<0){
        where.status = parseInt(status);
    }
    else if(status && status.indexOf(',')>=0){
        where.status = {$in: status.split(',').map(v => parseInt(v))};
    }
    
    let order = [['id', 'DESC']];
    if(status!=='' && status!=='0'){
        order = [['processed_at', 'DESC']];
    }
    const criteria = { where: where, offset: (page-1)*pageSize, limit: pageSize, order: order};

    console.log('criteria: ', criteria);

    const PromotionOrder = req.app.models.PromotionOrder;
    PromotionOrder.findAndCountAll(criteria)
         .then(function({count, rows}) {
         res.json({success: true, total: count, data: rows});
    });
}

export function get(req, res) {
	const id = req.params.id;
    const { PromotionOrder, Promotion } = req.app.models;
    const include = {model: Promotion, as: 'promotion', attributes:['title']};
    PromotionOrder.findById(id, {include}).then((item)=>{
        if(!item){
        	res.json({success: false, message:'记录不存在'});
        	return;
        }
        res.json({success: true, data: item});
    });
}

export function update(req, res){
    let {id} = req.params;
    id = parseInt(id);
    const {status, remark} = req.body;

    const PromotionOrder = req.app.models.PromotionOrder;

    PromotionOrder.update({status, remark, processed_at: new Date()}, {where: {id}})
    .then(() => {
        res.json({success: true});
    }).catch(err => {
        console.log(err);
        res.json({success: false, message: '更新失败, 请稍后再试'});
    })
}