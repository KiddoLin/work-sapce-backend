import date from '../../utils/date';

export function list(req, res) {
    let {pageSize, page, status} = req.query;
    pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);
    
    let where = {};
 
    const now = new Date().format('yyyy-MM-dd hh:mm:ss');
    if(status && status=='0'){
        where.end_time = {$gte: now};
    }
    else if(status && status=='1'){
        where.end_time = {$lte: now};
    }
    const criteria = { where: where, offset: (page-1)*pageSize, limit: pageSize, order: [['id', 'DESC']]};
    const { Promotion } = req.app.models;

    console.log('criteria: ', criteria);

    
    Promotion.findAndCountAll(criteria)
         .then(function({count, rows}) {
         res.json({success: true, total: count, data: rows});
    });
}

export function get(req, res) {
    let id = req.params.id;
    id = parseInt(id);
    const { Promotion, PromotionDetail } = req.app.models;
    Promotion.findById(id).then((item)=>{
        
        if(!item){
        	res.json({success: false, message:'记录不存在'});
        	return;
        }
        PromotionDetail.findAll({where: {promotion_id: id}}).then(details => {
            const {id, title, start_time, end_time, created_at} = item;
            const data = {id, title, start_time, end_time, created_at, details};
            res.json({success: true, data});
        }).catch(err => {
            console.log(err);
            res.json({success: false, message: '查询失败, 请稍后再试'});
        })     
    });
}

export function create(req, res) {
    const promotion = req.body;
    let {title, start_time, end_time, details} = promotion;
	if(!title || title.trim()===''){
		res.json({success: false, message: 'title参数不能为空'});
		return;
	}
	if(!start_time || start_time.trim()===''){
		res.json({success: false, message: 'start_time参数不能为空'});
		return;
	}
	if(!end_time || end_time.trim()===''){
		res.json({success: false, message: 'end_time参数不能为空'});
		return;
	}

    if(!details || details.length===0){
        res.json({success: false, message: 'details参数不能为空'});
        return;
    }
    if(details.length>5){
        res.json({success: false, message: 'details数据不能超过5条'});
        return;
    }

	const { Promotion, PromotionDetail } = req.app.models;
    const sequelize = req.app.sequelize;
	const where = {start_time: {$lt: end_time}, end_time: {$gt: start_time}};
    //where['$or'] = {start_time: {$lte: end_time}, end_time: {$gte: end_time}};
	Promotion.count({where}).then((cnt)=>{
        if(cnt>0){
            res.json({success: false, message: '该时间段内已有其它促销活动, 请修改活动时间'});
            return;
        }
        sequelize.transaction(transaction =>{
            return Promotion.create(promotion, {transaction}).then((item)=>{
                const id = item.id;
                details = details.map(d => {
                    d.promotion_id=id; 
                    return d;
                });
                console.log(details);
                return PromotionDetail.bulkCreate(details, {transaction}); 
            });
        })
        .then((result)=>{
            //console.log(result);
            res.json({success: true});
        })
        .catch(err => {
            console.log(err);
            res.json({success: false, message: '创建促销活动失败, 请稍后重试'});
        });
        // Promotion.create(promotion).then((item)=>{
        //     //console.log(item);
        //     const id = item.id;
        //     details = details.map(d => d.promotion_id=id);
        //     PromotionDetail.bulkCreate(details).then(result => {
        //         res.json({success: true});
        //     }).catch((err) =>{
        //         console.log(err);
        //         res.json({success: false, message: '创建促销活动失败, 请稍后重试'});
        //     });
        // }).catch((err)=>{
        // 	console.log(err);
        // 	res.json({success: false, message: '创建促销活动失败, 请稍后重试'});
        // });
    });
}

export function update(req, res){
	let {id} = req.params;
    id = parseInt(id);
	const promotion = req.body;
    const {title, start_time, end_time, details} = promotion;
	if(!title || title.trim()===''){
		res.json({success: false, message: 'title参数不能为空'});
		return;
	}
	if(!start_time || start_time.trim()===''){
		res.json({success: false, message: 'start_time参数不能为空'});
		return;
	}
	if(!end_time || end_time.trim()===''){
		res.json({success: false, message: 'end_time参数不能为空'});
		return;
	}

    if(!details || details.length===0){
        res.json({success: false, message: 'details参数不能为空'});
        return;
    }
    if(details.length>5){
        res.json({success: false, message: 'details数据不能超过5条'});
        return;
    }

	const { Promotion, PromotionDetail } = req.app.models;
    const sequelize = req.app.sequelize;
    //const where2 = {start_time: {$lte: start_time}, end_time: {$gte: start_time}}
    //where2['$or'] = {start_time: {$lte: end_time}, end_time: {$gte: end_time}};
    const where = {id: {$ne: id}, start_time: {$lt: end_time}, end_time: {$gt: start_time}};

	Promotion.count({where}).then((cnt)=>{
        if(cnt>0){
            res.json({success: false, message: '该时间段内已有其它促销活动, 请修改活动时间'});
            return;
        }
        sequelize.transaction(transaction =>{
            return Promotion.update(promotion, {where:{id}, transaction}).then((item)=>{
                //const id = item.id;
                //details = details.map(d => {
                //    d.promotion_id=id; 
                //    return d;
                //});
                console.log(details);
                const bulkUpdates = details.map((detail)=> {
                    return PromotionDetail.update(detail, {where: {id: detail.id}, transaction});
                });
                return Promise.all(bulkUpdates); 
            });
        })
        .then((result)=>{
            //console.log(result);
            res.json({success: true});
        })
        .catch(err => {
            console.log(err);
            res.json({success: false, message: '更新促销活动失败, 请稍后重试'});
        });
    });
}

export function remove(req, res) {
    let {id} = req.params;
    id = parseInt(id);
    const {Promotion, PromotionDetail, PromotionNotify, PromotionOrder} = req.app.models;
    PromotionNotify.count({where: {promotion_id: id}}).then((cnt)=>{
        if(cnt>0){
        	res.json({success: false, message: '已经有用户订阅该促销活动通知,无法删除'});
        	return;
        }
        PromotionOrder.count({where: {promotion_id: id}}).then((cnt1)=>{
            if(cnt1>0){
            	res.json({success: false, message: '已经有用户预订该促销活动,无法删除'});
        	    return;
            }
            PromotionDetail.destroy({where: {promotion_id: id}}).then((rows)=>{
                Promotion.destroy({where: {id}});
                res.json({success: true});
            }).catch(err=>{
                console.log(err);
                res.json({success: false, message: '删除失败, 请稍后再试'});
            });
        });
    });
}

export function removeDetail(req, res){
    let {id, did} = req.params;
    id = parseInt(id);
    did = parseInt(did);

    const {PromotionDetail, PromotionNotify, PromotionOrder} = req.app.models;

    PromotionNotify.count({where: {detail_id: did}}).then((cnt)=>{
        if(cnt>0){
            res.json({success: false, message: '已经有用户订阅该促销活动场地通知,无法删除'});
            return;
        }
        PromotionOrder.count({where: {detail_id: did}}).then((cnt1)=>{
            if(cnt1>0){
                res.json({success: false, message: '已经有用户预订该促销活动场地,无法删除'});
                return;
            }
            PromotionDetail.destroy({where: {id: did}}).then((rows)=>{
                res.json({success: true, data: {detail_id: did}});
            }).catch(err=>{
                console.log(err);
                res.json({success: false, message: '删除失败, 请稍后再试'});
            });
        });
    });
}

export function addDetail(req, res) {
    const promotion_id = parseInt(req.params.id);
    const {detail} = req.body;
    const {space_id, office_id, meetingroom_id} = detail;
    
    detail.promotion_id = promotion_id;

    const { PromotionDetail } = req.app.models;
    PromotionDetail.count({where: {promotion_id, office_id, meetingroom_id}}).then(cnt => {
        if(cnt>0){
            res.json({success: false, message: '该场地不能重复添加'});
            return;
        }
        PromotionDetail.create(detail).then(result =>{
            res.json({success: true, data: result});
            return;
        });
    });
}