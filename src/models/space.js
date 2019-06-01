import date from '../utils/date';

export default function(sequelize, DataTypes){
	const Space = sequelize.define("Space", {
        name: DataTypes.STRING,
        category: DataTypes.INTEGER,
        industry: {
            type: DataTypes.STRING,
            get: function(){
               const v = this.getDataValue('industry');
               return v ? v.split(',') : undefined;
            }
        },
        tags: {
            type: DataTypes.STRING,
            get: function(){
               const v = this.getDataValue('tags');
               return v ? v.split(',') : [];
            }
        },
        summary: {type: DataTypes.STRING, defaultValue: ''},
        office_intro: DataTypes.STRING,
        meetingrm_intro: DataTypes.STRING,
        pictures: {
            type: DataTypes.STRING(1024),
            get: function(){
                const v = this.getDataValue('pictures');
                return v ? v.split('\n').map((url,i) => { return {uid: '-' + i, url: url}; }) : undefined;
            }
        },
        operation_time_workday: {type: DataTypes.STRING, defaultValue: ''},
        operation_time_nonworkday: {type: DataTypes.STRING, defaultValue: ''},
        telephone: DataTypes.STRING,
        province: DataTypes.STRING,
        city: DataTypes.STRING,
        district: DataTypes.STRING,
        zone: DataTypes.STRING,
        address: DataTypes.STRING,
        latitude: DataTypes.DOUBLE(10,6),
        longitude: DataTypes.DOUBLE(10,6),
        area_in_sqm: {type: DataTypes.INTEGER, defaultValue: 0},
        num_of_fixed_desk: {type: DataTypes.INTEGER, defaultValue: 0},
        num_of_nonfixed_desk: {type: DataTypes.INTEGER, defaultValue: 0},
        num_of_office_room: {type: DataTypes.INTEGER, defaultValue: 0},
        num_of_meeting_room: {type: DataTypes.INTEGER, defaultValue: 0},
        num_of_event_room: {type: DataTypes.INTEGER, defaultValue: 0},
        facilities: {
            type: DataTypes.STRING(512),
            get: function(){
                const v = this.getDataValue('facilities');
                return v ? JSON.parse(v) : undefined;
            }
        },
        usage: DataTypes.STRING,
        is_nearby_mtr: DataTypes.BOOLEAN,
        traffic_desc: DataTypes.STRING,
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
        mgr_avatar: DataTypes.STRING,
        map_stat: {
            type: DataTypes.STRING,
            get: function(){
                const v = this.getDataValue('map_stat');
                return v ? JSON.parse(v) : undefined;
            }
        }
    },{
    	tableName: 'space',
    	timestamps: false
    });
    return Space;
}