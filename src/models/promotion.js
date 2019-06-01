import date from '../utils/date';

export default function(sequelize, DataTypes){
	const Promotion = sequelize.define("Promotion", {
        title: DataTypes.STRING,
        start_time: {
            type: DataTypes.DATE(6),
            get: function(){
                const v = this.getDataValue('start_time');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
            }
        },
        end_time: {
            type: DataTypes.DATE(6),
            get: function(){
                const v = this.getDataValue('end_time');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
            }
        },
        created_at: {
            type: DataTypes.DATE(6),
            get: function(){
                const v = this.getDataValue('created_at');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
            }
        }
    },{
    	tableName: 'promotion',
    	timestamps: false
    });
    return Promotion;
}