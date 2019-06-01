import date from '../utils/date';

export default function(sequelize, DataTypes){
	const MoneyTrans = sequelize.define("MoneyTrans", {
        order_no: DataTypes.STRING,
        transaction_id: DataTypes.STRING,
        type: DataTypes.INTEGER,
        payment_type: DataTypes.INTEGER,
        amount: DataTypes.DOUBLE(8,2),
        user_id: DataTypes.INTEGER,
        created_at: {
        	type: DataTypes.DATE(6),
        	get: function(){
                const v = this.getDataValue('created_at');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
        	}
        },
        check_status: DataTypes.INTEGER,
        checked_at: {
            type: DataTypes.DATE(6),
            get: function(){
                const v = this.getDataValue('checked_at');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
            }
        },
        remark: DataTypes.STRING
        
    },{
    	tableName: 'money_trans',
    	timestamps: false
    });

    MoneyTrans.associate = function(models){
        MoneyTrans.belongsTo(models.Order, {as: 'order', foreignKey: 'order_no', targetKey: 'order_no'});
    }
    return MoneyTrans;
}