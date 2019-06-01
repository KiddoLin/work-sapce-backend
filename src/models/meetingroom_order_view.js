import date from '../utils/date';

export default function(sequelize, DataTypes){
	const MeetingroomOrderView = sequelize.define("MeetingroomOrderView", {
        user_id: DataTypes.INTEGER,
        space_id: DataTypes.INTEGER,
        space_name: DataTypes.STRING,
        meetingroom_id: DataTypes.INTEGER,
        category: DataTypes.INTEGER,
        name: DataTypes.STRING,
        picture: DataTypes.STRING(512),
        price_per_hour: DataTypes.DOUBLE(6,2),
        year: DataTypes.INTEGER,
        month: DataTypes.INTEGER,
        day: DataTypes.INTEGER,
        start_time: DataTypes.INTEGER,
        end_time: DataTypes.INTEGER,
        total_hours: DataTypes.INTEGER,
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
    	tableName: 'view_meetingroom_order',
    	timestamps: false
    });
    return MeetingroomOrderView;
}