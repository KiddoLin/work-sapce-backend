import date from '../utils/date';

export default function(sequelize, DataTypes){
	const Meetingroom = sequelize.define("Meetingroom", {
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
        price_per_hour: DataTypes.DOUBLE(6,2),
        min_rent_hours: {type: DataTypes.INTEGER, defaultValue: 1},
        is_weekend_excluded: {type: DataTypes.INTEGER, defaultValue: 0},
        is_holiday_excluded: {type: DataTypes.INTEGER, defaultValue: 0},
        dates_excluded: { 
            type: DataTypes.STRING,
            get: function(){
                const v = this.getDataValue('dates_excluded');
                return v ? JSON.parse(v) : undefined;
            }
        },
        capacity: DataTypes.INTEGER,
        workday_time_start: DataTypes.INTEGER,
        workday_time_end: DataTypes.INTEGER,
        nonworkday_time_start: DataTypes.INTEGER,
        nonworkday_time_end: DataTypes.INTEGER,
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
    	tableName: 'meetingroom',
    	timestamps: false
    });

    Meetingroom.associate = function(models){
        Meetingroom.belongsTo(models.Space, {as: 'space', foreignKey: 'space_id'});
    }
    return Meetingroom;
}