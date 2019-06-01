import { diffDays } from '../../utils/date';
import ExcelExporter from 'excel-export-es6';

export function list(req, res) {
	let { pageSize, page, start, end, type, category, space_name} = req.query;

	pageSize = parseInt(pageSize || 10);
    page = parseInt(page || 1);
    
    let where = {};

    if(type && type!==''){
    	where.type = type;
    }

    if(start && start!==''){
        if(!where.created_at)
            where.created_at = {};
        where.created_at['$gte'] = start + ' 00:00:00';
    }
    if(end && end!==''){
        if(!where.created_at)
            where.created_at = {};
        where.created_at['$lte'] = end + ' 23:59:59';
    }

    if(category && category!==''){
    	let c = category.split('-');
    	if(c.length<2){
    		res.json({success: false, message: 'category参数格式错误'});
    		return;
    	}
    	where['$order.order_type$'] = c[0];
    	where['$order.category$'] = c[1];
    }

    if(space_name && space_name!==''){
        space_name = space_name.trim();
    	where['$order.space_name$'] = {$like: `%${space_name}%`};
    }

    const {MoneyTrans, Order} = req.app.models;
    
    const criteria = { where: where, offset: (page-1)*pageSize, limit: pageSize, order: [['id', 'DESC']]};
    criteria.include = {model: Order, as: 'order', attributes:['id', 'space_name','order_type','category','contact_name']};

    //console.log('criteria: ', criteria);

    
    MoneyTrans.findAndCountAll(criteria)
         .then(function({count, rows}) {
         res.json({success: true, total: count, data: rows});
    });
}

//0-固定工位 1-移动工位 2-办公室
const OfficeEnum = [
     '固定工位',
     '移动工位',
     '办公室'
]

//0-会议室 1-活动场地
const MeetingroomEnum = [
      '会议室',
      '活动场地'
]

const PaymentEnum = ['微信支付']

export function exportExcel(req ,res) {
    let {start, end, type, category, space_name} = req.query;

    // if(!start || start==='' || !end || end===''){
    //     res.json({success: false, message: 'start与end参数不能为空!'});
    //     return;
    // }
    // if(diffDays(start, end)>90){
    //  res.json({success: false, message: '每次最多只能导出90天的交易记录'});
    //  return;
    // }

    //let where = {created_at: {$gte: start, $lte: end}};
    let where = {};

    if(type && type!==''){
        where.type = type;
    }

    if(start && start!==''){
        if(!where.created_at)
            where.created_at = {};
        where.created_at['$gte'] = start;
    }
    if(end && end!==''){
        if(!where.created_at)
            where.created_at = {};
        where.created_at['$lte'] = end;
    }

    if(category && category!==''){
        let c = category.split('-');
        if(c.length<2){
            res.json({success: false, message: 'category参数格式错误'});
            return;
        }
        where['$order.order_type$'] = c[0];
        where['$order.category$'] = c[1];
    }

    if(space_name && space_name!==''){
        space_name = space_name.trim();
        where['$order.space_name$'] = {$like: `%${space_name}%`};
    }

    const {MoneyTrans, Order} = req.app.models;
    
    const criteria = { where: where, order: [['id', 'ASC']]};
    criteria.include = {model: Order, as: 'order', attributes:['id', 'space_name','order_type','category','contact_name']};

    console.log('criteria: ', criteria);

    MoneyTrans.count(criteria).then((count) =>{
        if(count>10000){
            res.json({success:false, message: '导出记录条数不能超过1万条,请设置筛选条件'});
            return;
        }
        MoneyTrans.findAll(criteria).then((trans)=>{
        const rows = trans.map((item)=>{
            let {id, order_no, order, type, amount, payment_type, created_at, transaction_id} = item;
            let category = '';
            switch(order.order_type){
                case 1: category = OfficeEnum[order.category]; break;
                case 2: category = MeetingroomEnum[order.category];break;
                default: break;
            }
            let sType = type===0 ? '收入' : '支出';
            return [id, order_no, order.space_name, category, sType , amount, PaymentEnum[payment_type], created_at, transaction_id, order.contact_name];
        });
        const cols = [
            {caption: 'ID', type: 'number', width: 10},
            {caption: '订单编号', type: 'string', width: 22},
            {caption: '所属孵化器', type: 'string', width: 30},
            {caption: '场地类型', type: 'string', width: 12},
            {caption: '交易类型', type: 'string', width: 10},
            {caption: '交易金额', type: 'number', width: 15},
            {caption: '支付方式', type: 'string', width: 12},
            {caption: '交易时间', type: 'string', width: 22},
            {caption: '交易流水号', type: 'string', width: 30},
            {caption: '订单联系人', type: 'string', width: 15},
        ];
        const name = `${start}~${end}`;
        ExcelExporter.execute({cols, rows, name}, (err, path)=>{
            if(err){
                console.log(err);
                res.json({success: false, message: err});
                return;
            }
            res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
            res.setHeader('Content-Disposition', 'attachment; filename=Cocoworking.xlsx');
            res.sendFile(path);
        });
        });

    });
}