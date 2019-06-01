import date from '../utils/date';

export default function(sequelize, DataTypes){
	const Office = sequelize.define("Office", {
        name: DataTypes.STRING,
        category: DataTypes.INTEGER,
        tags: {
            type: DataTypes.STRING,
            get: function(){
               const v = this.getDataValue('tags');
               return v ? v.split(',') : undefined;
            }
        },
        picture: {
            type: DataTypes.STRING(512),
            get: function(){
                const v = this.getDataValue('picture');
                return v ? v.split('\n').map((url,i) => { return {uid: '-' + i, url: url}; }) : undefined;
            }
        },
        rent_model: {type: DataTypes.ENUM(0,1,2), defaultValue: 0},
        price_per_day: DataTypes.DOUBLE(6,2),
        price_per_month: DataTypes.DOUBLE(8,2),
        min_rent_days: {type: DataTypes.INTEGER, defaultValue: 1},
        min_rent_months: {type: DataTypes.INTEGER, defaultValue: 1},
        is_weekend_excluded: {type: DataTypes.INTEGER, defaultValue: 0},
        is_holiday_excluded: {type: DataTypes.INTEGER, defaultValue: 0},
        dates_excluded: { 
            type: DataTypes.STRING,
            get: function(){
                const v = this.getDataValue('dates_excluded');
                return v ? JSON.parse(v) : undefined;
            }
        },
        num_of_unit: DataTypes.INTEGER,
        status: {type: DataTypes.ENUM(0,1), defaultValue: 0},
        created_at: {
        	type: DataTypes.DATE(6),
        	get: function(){
                const v = this.getDataValue('created_at');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
        	}
        },
        updated_at: {
        	type: DataTypes.DATE(6),
        	get: function(){
        		const v = this.getDataValue('updated_at');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
        	}
        },
    },{
    	tableName: 'office',
    	timestamps: false
    });

    Office.associate = function(models){
        Office.belongsTo(models.Space, {as: 'space', foreignKey: 'space_id'});
    }
    return Office;
}