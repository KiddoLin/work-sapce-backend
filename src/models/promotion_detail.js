import date from '../utils/date';

export default function(sequelize, DataTypes){
	const PromotionDetail = sequelize.define("PromotionDetail", {
        promotion_id: DataTypes.INTEGER,
        space_id: DataTypes.INTEGER,
        space_name: DataTypes.STRING,
        type: DataTypes.INTEGER,
        category: DataTypes.INTEGER,
        office_id: DataTypes.INTEGER,
        meetingroom_id: DataTypes.INTEGER,
        booking_name: DataTypes.STRING,
        price: DataTypes.DOUBLE(8,2),
        unit_of_time: DataTypes.STRING,
        remark: DataTypes.STRING
    },{
    	tableName: 'promotion_detail',
    	timestamps: false
    });
    return PromotionDetail;
}