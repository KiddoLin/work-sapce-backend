import date from '../../utils/date';
import {fetchMapStat} from './qqmap';


export function list(req, res) {
	let { pageSize, page, select, category, status, keyword } = req.query;

	pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);
    
    let where = {};
    if(category && category!==''){
    	where.category = category;
    }
    if(status && status!==''){
        where.status = status;
    }
    if(keyword && keyword!==''){
        keyword = keyword.trim();
    	where['$or'] = {
    		name: {$like: `%${keyword}%`},
    		industry: {$like: `%${keyword}%`}
        }
    }
    
    const criteria = { where: where, offset: (page-1)*pageSize, limit: pageSize, order: [['id', 'DESC']]};
    if(select && select!==''){
    	criteria.attributes = select.split(',');
    }
    console.log('criteria: ', criteria);

    const Space = req.app.models.Space;
    Space.findAndCountAll(criteria)
         .then(function({count, rows}) {
         //console.log(result.count);
         //console.log(result.rows);
         res.json({success: true, total: count, data: rows});
    });
}

export function get(req, res) {
	const id = req.params.id;
    const Space = req.app.models.Space;
    Space.findById(id).then((item)=>{
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

export function create(req, res){
	const space = req.body;
	if(!space.name || space.name.trim()===''){
		res.json({success: false, message: 'name参数不能为空'});
		return;
	}

	let {industry, tags, pictures, facilities, latitude, longitude} = space;
	space.industry = industry ? industry.join(',') : '';
    space.tags = tags ? tags.join(',') : '';
	space.pictures = pictures.map((pic) => pic.url).join('\n');
	space.facilities = JSON.stringify(facilities);

    const Space = req.app.models.Space;
    space.created_at = new Date();
    
    const qmapCfg = req.app.config.qqmap;
    fetchMapStat(qmapCfg, {lat: latitude, lng: longitude}, (err, data) => {
        if(!err){
            space.map_stat = JSON.stringify(data);
        }
        console.log('Create Space: ', space);
        Space.create(space).then(()=>{
            res.json({success: true});
        });
    });
}

export function update(req, res){
	const {id} = req.params;
	const space = req.body;
	if(!space.name || space.name.trim()===''){
		res.json({success: false, message: 'name参数不能为空'});
		return;
	}
 
	let {industry, tags, pictures, facilities, latitude, longitude} = space;
	space.industry = industry ? industry.join(',') : '';
    space.tags = tags ? tags.join(',') : '';
	space.pictures = pictures.map((pic) => pic.url).join('\n');
	space.facilities = JSON.stringify(facilities);
    //space.updated_at = new Date();
    
    const Space = req.app.models.Space;
    const qmapCfg = req.app.config.qqmap;
    fetchMapStat(qmapCfg, {lat: latitude, lng: longitude}, (err, data) => {
        if(!err){
            space.map_stat = JSON.stringify(data);
        }
        console.log('Update Space: ', space);
        Space.update(space, {where: {id: parseInt(id)}}).then(()=>{
            res.json({success: true});
        });
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
    const Space = req.app.models.Space;
    Space.update(data,{ where: {id: id}}).then((result)=>{
    	console.log('PATCH >', result);
        return res.json({success: true, data: data});
    });
}

export function remove(req, res){
    let { id } = req.params;
    id = parseInt(id);
    const {Space, Office, Meetingroom, User} = req.app.models;

    Space.findById(id, {attributes: ['id','status']})
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
                Office.count({where: {space_id: id}}), 
                Meetingroom.count({where: {space_id: id}}), 
                User.count({where: {space_id: id}})
            ])
            .then(result => {
                if(result[0]>0){
                    res.json({success: false, message: '已有关联的办公场地,不能被删除'});
                    return;
                }
                if(result[1]>0){
                    res.json({success: false, message: '已有关联的会议/活动场地,不能被删除'});
                    return;
                }
                if(result[2]>0){
                    res.json({success: false, message: '已有用户入驻该孵化器,不能被删除'});
                    return;
                }

                Space.destroy({where: {id}}).then((rows) => {
                    res.json({success: true});
                });
            })
            .catch(err => {
                console.log(err);
                res.json({success: false, message: '删除失败'});
            })
    });
}

export function listOmrs(req, res){
    let { id } = req.params;
    id = parseInt(id);
    const { Office, Meetingroom } = req.app.models;
    const oAttrs = ['id', 'space_id', 'name', 'category', 'rent_model', 'price_per_day', 'price_per_month'];
    const mrAttrs = ['id', 'space_id', 'name', 'category', 'price_per_hour'];
    Promise.all([
        Office.findAll({where: {space_id: id, status: 1}, attributes: oAttrs}),
        Meetingroom.findAll({where: {space_id: id, status: 1}, attributes: mrAttrs})
    ])
    .then(result =>{
        res.json({success: true, data: {offices: result[0], meetingrooms: result[1]}});
    })
    .catch(err => {
        console.log(err);
        res.json({success: false, message: '查询失败'});
    });
}
