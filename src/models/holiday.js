import date from '../utils/date';

export default function(sequelize, DataTypes){
	const Holiday = sequelize.define("Holiday", {
        year: DataTypes.INTEGER,
        idx: DataTypes.INTEGER,
        name: DataTypes.STRING,
        dates: {
            type: DataTypes.STRING,
            get: function(){
                const v = this.getDataValue('dates');
                return v ? JSON.parse(v) : undefined;
            }
        },
        dates_onduty: {
            type: DataTypes.STRING,
            get: function(){
                const v = this.getDataValue('dates_onduty');
                return v ? JSON.parse(v) : undefined;
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
    	tableName: 'holiday',
    	timestamps: false
    });
    return Holiday;
}