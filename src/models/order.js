import date from '../utils/date';

export default function(sequelize, DataTypes){
	const Order = sequelize.define("Order", {
        order_no: DataTypes.STRING,
        space_id: DataTypes.INTEGER,
        space_name: DataTypes.STRING,
        order_type: DataTypes.INTEGER,
        office_id: DataTypes.INTEGER,
        meetingroom_id: DataTypes.INTEGER,
        category: DataTypes.INTEGER,
        booking_name: DataTypes.STRING,
        picture: DataTypes.STRING(512),
        price: DataTypes.DOUBLE(6,2),
        from_date: {
            type: DataTypes.DATE(6),
            get: function(){
                const t = this.getDataValue('order_type');
                const f = t===1 ? 'yyyy-MM-dd' : 'yyyy-MM-dd hh:mm';
                const v = this.getDataValue('from_date');
                return v ? v.format(f) : undefined;
            }
        },
        to_date: {
            type: DataTypes.DATE(6),
            get: function(){
                const t = this.getDataValue('order_type');
                const f = t===1 ? 'yyyy-MM-dd' : 'yyyy-MM-dd hh:mm';
                const v = this.getDataValue('to_date');
                return v ? v.format(f) : undefined;
            }
        },
        total_time: DataTypes.INTEGER,
        unit_of_time: DataTypes.STRING,
        total_units: DataTypes.INTEGER,
        discount: DataTypes.INTEGER,
        payment_amount: DataTypes.DOUBLE(8,2),
        cancel_fee: DataTypes.DOUBLE(8,2),
        status: DataTypes.INTEGER,
        source: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
        contact_name: DataTypes.STRING,
        contact_phone: DataTypes.STRING,
        created_at: {
        	type: DataTypes.DATE(6),
        	get: function(){
                const v = this.getDataValue('created_at');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
        	}
        },
        canceled_at: {
        	type: DataTypes.DATE(6),
        	get: function(){
        		const v = this.getDataValue('canceled_at');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
        	}
        },   
        payed_at: {
            type: DataTypes.DATE(6),
            get: function(){
                const v = this.getDataValue('payed_at');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
            }
        },
        verified_at: {
            type: DataTypes.DATE(6),
            get: function(){
                const v = this.getDataValue('verified_at');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
            }
        },
        vcode: DataTypes.STRING,
        verifier_id: DataTypes.INTEGER,
        verifier_name: DataTypes.STRING,
        dates: {
            type: DataTypes.STRING,
              get: function(){
                const v = this.getDataValue('dates');
                return v ? JSON.parse(v) : [];
            }
        }
    },{
    	tableName: 'order',
    	timestamps: false
    });
    return Order;
}