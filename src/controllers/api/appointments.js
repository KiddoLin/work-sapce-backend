import date from '../../utils/date';


export function list(req, res) {
	let { pageSize, page, purpose, start, end, keyword } = req.query;

	pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);
    
    let where = {};
    if(purpose && purpose!==''){
        where.purpose = purpose;
    }
    if(start && start!==''){
        if(!where.appoint_time)
            where.appoint_time = {};
        where.appoint_time['$gte'] = start + ' 00:00:00';
    }
    if(end && end!==''){
        if(!where.appoint_time)
            where.appoint_time = {};
        where.appoint_time['$lte'] = end + ' 23:59:59';
    }
    if(keyword && keyword!==''){
        keyword = keyword.trim();
    	where['$or'] = {
    		contact_name:  {$like: `%${keyword}%`},
            contact_phone: {$like: `%${keyword}%`},
            space_name: {$like: `%${keyword}%`}
        }
    }

    const {Appointment} = req.app.models;
    
    const criteria = { where: where, offset: (page-1)*pageSize, limit: pageSize, order: [['id', 'DESC']]};
    //criteria.include = {model: Space, as: 'space', attributes:['name']};

    console.log('criteria: ', criteria);
    
    Appointment.findAndCountAll(criteria)
               .then(function({count, rows}) {
         res.json({success: true, total: count, data: rows});
    });
}

export function get(req, res) {
	const id = req.params.id;
    const {Appointment} = req.app.models;
    //const include = {model: Space, as: 'space', attributes:['name']};
    Appointment.findById(id, {include}).then((item)=>{
        if(!item){
        	res.json({success: false, message:'记录不存在'});
        	return;
        }
        res.json({success: true, data: item});
    });
}