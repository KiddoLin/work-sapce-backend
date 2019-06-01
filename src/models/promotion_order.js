import date from '../utils/date';

export default function(sequelize, DataTypes){
	const PromotionOrder = sequelize.define("PromotionOrder", {
        order_no: DataTypes.STRING,
        promotion_id: DataTypes.INTEGER,
        detail_id: DataTypes.INTEGER,
        space_id: DataTypes.INTEGER,
        space_name: DataTypes.STRING,
        type: {type: DataTypes.ENUM(1,2), defaultValue: 1},
        category: DataTypes.INTEGER,
        office_id: DataTypes.INTEGER,
        meetingroom_id: DataTypes.INTEGER,
        booking_name: DataTypes.STRING,
        user_id: DataTypes.INTEGER,
        form_id: DataTypes.STRING,
        use_date: {
            type: DataTypes.DATEONLY/*,
            get: function(){
                const v = this.getDataValue('use_date');
                return v ? v.format('yyyy-MM-dd') : undefined;
            }*/
        },
        num_of_person: DataTypes.INTEGER,
        contact_name: DataTypes.STRING,
        contact_phone: DataTypes.STRING,
        purpose: { type: DataTypes.ENUM(0,1,2,3,4,5), defaultValue: 0 },
        created_at: {
            type: DataTypes.DATE(6),
            get: function(){
                const v = this.getDataValue('created_at');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
            }
        },
        status: { type: DataTypes.ENUM(0,1,2), defaultValue: 0 },
        remark: DataTypes.STRING,
        processed_at: {
            type: DataTypes.DATE(6),
            get: function(){
                const v = this.getDataValue('processed_at');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
            }
        }
    },{
    	tableName: 'promotion_order',
    	timestamps: false
    });
    PromotionOrder.associate = function(models){
        PromotionOrder.belongsTo(models.Promotion, {as: 'promotion', foreignKey: 'promotion_id'});
    }
    return PromotionOrder;
}