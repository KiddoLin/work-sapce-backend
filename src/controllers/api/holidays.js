import date from '../../utils/date';


export function list(req, res) {
	let { pageSize, page, year } = req.query;

	pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);
    
    let where = {};
    if(year && year!==''){
        where.year = year;
    }
    const {Holiday} = req.app.models;
    
    const criteria = { where: where, offset: (page-1)*pageSize, limit: pageSize, order: [['idx', 'ASC']]};
    
    console.log('criteria: ', criteria);
    
    Holiday.findAndCountAll(criteria)
               .then(function({count, rows}) {
         res.json({success: true, total: count, data: rows});
    });
}

export function get(req, res) {
	let {id} = req.params;
    id = parseInt(id);
    const {Holiday} = req.app.models;
    //const include = {model: Space, as: 'space', attributes:['name']};
    Holiday.findById(id).then((item)=>{
        if(!item){
        	res.json({success: false, message:'记录不存在'});
        	return;
        }
        res.json({success: true, data: item});
    });
}

export function create(req, res){
    const holiday = req.body;
    let {year, idx, name, dates, dates_onduty} = holiday;
    if(!year || year===''){
        res.json({success: false, message: 'year不能为空'});
        return;
    }

    if(idx===null || idx===undefined || idx===''){
        res.json({success: false, message: 'idx参数不能为空'});
        return;
    }

    if(!name || name.trim()===''){
        res.json({success: false, message: 'name参数不能为空'});
        return;
    }

    if(!Array.isArray(dates) && dates.length>0){
        res.json({success: false, message: 'dates参数必须为非空数组'});
        return;
    }

    const Holiday = req.app.models.Holiday;
    Holiday.count({where: {year: year, name: name}}).then((cnt)=>{
        if(cnt>0){
            res.json({success: false, message: '此节假日已经添加'});
            return;
        }

        holiday.created_at = new Date();
        holiday.dates = JSON.stringify(dates);
        if(Array.isArray(dates_onduty)){
            holiday.dates_onduty = JSON.stringify(dates_onduty);
        }
        console.log('Create holiday: ', holiday);
        Holiday.create(holiday).then(()=>{
            res.json({success: true});
        }).catch((err)=>{
            console.log(err);
            res.json({success: false, message: '数据库操作异常'});
        });
    });
}

export function update(req, res){
    let {id} = req.params;
    id = parseInt(id);
    const holiday = req.body;
    const {year, idx, name, dates, dates_onduty} = holiday;
    if(!year || year===''){
        res.json({success: false, message: 'year不能为空'});
        return;
    }

    if(idx===null || idx===undefined || idx===''){
        res.json({success: false, message: 'idx参数不能为空'});
        return;
    }

    if(!name || name.trim()===''){
        res.json({success: false, message: 'name参数不能为空'});
        return;
    }
    
    if(!Array.isArray(dates) && dates.length>0){
        res.json({success: false, message: 'dates参数必须为非空数组'});
        return;
    }

    const Holiday = req.app.models.Holiday;
    Holiday.count({where: {id: {$ne: id}, year: year, name: name}}).then((cnt)=>{
        if(cnt>0){
            res.json({success: false, message: '此节假日已经添加'});
            return;
        }

        holiday.dates = JSON.stringify(dates);
        if(Array.isArray(dates_onduty)){
            holiday.dates_onduty = JSON.stringify(dates_onduty);
        }
        console.log('Update holiday: ', holiday);
        Holiday.update(holiday, {where: {id: id}}).then(()=>{
            res.json({success: true});
        }).catch((err)=>{
            console.log(err);
            res.json({success: false, message: '数据库操作异常'});
        });
    });
}

export function remove(req, res){
    let {id} = req.params;
    id = parseInt(id);
    const Holiday = req.app.models.Holiday;
    Holiday.destroy({where: {id}})
           .then((rows) => {
                res.json({success: true});
           })
           .catch(err => {
                console.log(err);
                res.json({success: false, message: '删除失败'});
    });
}