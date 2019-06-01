import date from '../utils/date';

export default function(sequelize, DataTypes){
	const OfficeOrderView = sequelize.define("OfficeOrderView", {
        user_id: DataTypes.INTEGER,
        space_id: DataTypes.INTEGER,
        space_name: DataTypes.STRING,
        office_id: DataTypes.INTEGER,
        category: DataTypes.INTEGER,
        name: DataTypes.STRING,
        picture: DataTypes.STRING(512),
        price_per_day: DataTypes.DOUBLE(6,2),
        from_year: DataTypes.INTEGER,
        from_month: DataTypes.INTEGER,
        from_day: DataTypes.INTEGER,
        to_year: DataTypes.INTEGER,
        to_month: DataTypes.INTEGER,
        to_day: DataTypes.INTEGER,
        total_days: DataTypes.INTEGER,
        total_units: DataTypes.INTEGER,
        discount: DataTypes.DOUBLE(2,1),
        payment_amount: DataTypes.DOUBLE(8,2),
        source: DataTypes.INTEGER,
        contact_name: DataTypes.STRING,
        contact_phone: DataTypes.STRING,
        status: DataTypes.INTEGER,
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
        cancel_fee: DataTypes.DOUBLE(8,2),
    },{
    	tableName: 'view_office_order',
    	timestamps: false
    });
    return OfficeOrderView;
}