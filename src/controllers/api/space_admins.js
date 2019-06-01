import date from '../../utils/date';
import crypto from 'crypto';

// const CRYPTO_SALT = 'fuckgfw@_@';
// const CRYPTO_ITERATIONS = 100;
// const CRYPTO_KEY_LEN = 24;
// const CRYPTO_DIGEST = 'sha1';

function cryptoPwd(pwd, config) {
    let {salt, iterations, keyLen, digest} = config;
    const key = crypto.pbkdf2Sync(pwd, salt, iterations, keyLen, digest);
    return key.toString('hex');
}

export function list(req, res) {
	let { pageSize, page, role, status, keyword } = req.query;

	pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);
    
    let where = {};
    if(role && role!==''){
    	where.role = role;
    }
    if(status && status!==''){
        where.status = status;
    }
    if(keyword && keyword!==''){
        keyword = keyword.trim();
    	where['$or'] = {
    		username:  {$like: `%${keyword}%`},
            telephone: {$like: `%${keyword}%`},
            '$space.name$': {$like: `%${keyword}%`}
        }
    }

    const {SpaceAdmin, Space} = req.app.models;
    
    const criteria = { where: where, offset: (page-1)*pageSize, limit: pageSize, order: [['id', 'DESC']]};
    criteria.include = {model: Space, as: 'space', attributes:['name']};

    console.log('criteria: ', criteria);
    
    SpaceAdmin.findAndCountAll(criteria)
         .then(function({count, rows}) {
         //console.log(result.count);
         //console.log(result.rows);
         res.json({success: true, total: count, data: rows});
    });
}

export function get(req, res) {
	const id = req.params.id;
    const {SpaceAdmin, Space} = req.app.models;
    const include = {model: Space, as: 'space', attributes:['name']};
    SpaceAdmin.findById(id, {include}).then((item)=>{
        if(!item){
        	res.json({success: false, message:'记录不存在'});
        	return;
        }
        res.json({success: true, data: item});
    });
}

function createModel(req, res, SpaceAdmin, spaceAdmin){
    spaceAdmin.create_time = new Date();
    if(spaceAdmin.password && spaceAdmin.password!==''){
        const cryptoCfg = req.app.config.crypto.password;
        spaceAdmin.password = cryptoPwd(spaceAdmin.password, cryptoCfg);
    }
    
    console.log('Create SpaceAdmin: ', spaceAdmin);
    SpaceAdmin.create(spaceAdmin).then(()=>{
        res.json({success: true});
    }).catch((err)=>{
        console.log(err);
        res.json({success: false, message: '数据库操作异常'});
    });
}

export function create(req, res){
    const spaceAdmin = req.body;
    if(!spaceAdmin.username || spaceAdmin.username.trim()===''){
        res.json({success: false, message: 'username不能为空'});
        return;
    }

    if(!spaceAdmin.telephone || spaceAdmin.telephone.trim()===''){
        res.json({success: false, message: 'telephone参数不能为空'});
        return;
    }

    const SpaceAdmin = req.app.models.SpaceAdmin;
    SpaceAdmin.count({where: {telephone: spaceAdmin.telephone}}).then((cnt)=>{
        if(cnt>0){
            res.json({success: false, message: '手机号已经存在'});
            return;
        }

        if(spaceAdmin.role!=0){
            createModel(req, res, SpaceAdmin, spaceAdmin);
            return;
        }
        //check if mutiple super admin exists
        SpaceAdmin.count({where: {space_id: spaceAdmin.space_id, role: 0}}).then((cnt)=>{
            if(cnt>0){
                res.json({success: false, message: '同一孵化器只能创建一个超级管理员'});
                return;
            }
            createModel(req, res, SpaceAdmin, spaceAdmin);
        });
    });
}

function updateModel(req, res, id, SpaceAdmin, spaceAdmin){
    spaceAdmin.update_time = new Date();

    if(spaceAdmin.password===''){
        delete spaceAdmin.password;
    }
    if(spaceAdmin.password){
        const cryptoCfg = req.app.config.crypto.password;
        spaceAdmin.password = cryptoPwd(spaceAdmin.password, cryptoCfg);
    }

    SpaceAdmin.update(spaceAdmin, {where: {id: id}}).then(()=>{
        res.json({success: true});
    }).catch((err)=>{
        console.log(err);
        res.json({success: false, message: '数据库操作异常'});
    });
}

export function update(req, res){
    const {id} = req.params;
    const spaceAdmin = req.body;
    if(!spaceAdmin.username || spaceAdmin.username.trim()===''){
        res.json({success: false, message: 'username参数不能为空'});
        return;
    }

    if(!spaceAdmin.telephone || spaceAdmin.telephone.trim()===''){
        res.json({success: false, message: 'telephone参数不能为空'});
        return;
    }
    
    const SpaceAdmin = req.app.models.SpaceAdmin;
    SpaceAdmin.count({where: {id: {$ne: id}, telephone: spaceAdmin.telephone}}).then((cnt)=>{
        if(cnt>0){
            res.json({success: false, message: '手机号已经存在'});
            return;
        }
        if(spaceAdmin.role!=0){
            updateModel(req, res, id, SpaceAdmin, spaceAdmin);
            return;
        }

        //check if mutiple super admin exists
        SpaceAdmin.count({where: {id: {$ne: id}, space_id: spaceAdmin.space_id, role: 0}}).then((cnt)=>{
            if(cnt>0){
                res.json({success: false, message: '该孵化器已经有一个超级管理员'});
                return;
            }
            updateModel(req, res, id, SpaceAdmin, spaceAdmin);
        });
        // spaceAdmin.update_time = new Date();

        // if(spaceAdmin.password===''){
        //     delete spaceAdmin.password;
        // }
        // if(spaceAdmin.password){
        //     const cryptoCfg = req.app.config.crypto.password;
        //     spaceAdmin.password = cryptoPwd(spaceAdmin.password, cryptoCfg);
        // }

        // SpaceAdmin.update(spaceAdmin, {where: {id: id}}).then(()=>{
        //     res.json({success: true});
        // });
    });
}


export function patch(req, res){
    const { id } = req.params
    const {nextStatus} = req.body;
    let data = {};
    if(nextStatus===undefined){
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

    const SpaceAdmin = req.app.models.SpaceAdmin;
    SpaceAdmin.update(data,{ where: {id: id}}).then((result)=>{
        console.log('PATCH >', result);
        return res.json({success: true, data: data});
    });
}
