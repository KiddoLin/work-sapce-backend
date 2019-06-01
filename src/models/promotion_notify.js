import date from '../utils/date';

export default function(sequelize, DataTypes){
	const PromotionNotify = sequelize.define("PromotionNotify", {
        promotion_id: DataTypes.INTEGER,
        detail_id: DataTypes.INTEGER,
        space_id: DataTypes.INTEGER,
        space_name: DataTypes.STRING,
        type: DataTypes.INTEGER,
        category: DataTypes.INTEGER,
        office_id: DataTypes.INTEGER,
        meetingroom_id: DataTypes.INTEGER,
        booking_name: DataTypes.STRING,
        user_id: DataTypes.INTEGER
    },{
    	tableName: 'promotion_notify',
    	timestamps: false
    });
    return PromotionNotify;
}