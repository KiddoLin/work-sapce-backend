import date from '../utils/date';

export default function(sequelize, DataTypes){
	const SpaceAdmin = sequelize.define("SpaceAdmin", {
        username: DataTypes.STRING,
        role: DataTypes.INTEGER,
        password: DataTypes.STRING,
        telephone: DataTypes.STRING,
        title: DataTypes.STRING,
        gender: {type: DataTypes.ENUM(0,1), defaultValue: 0},
        status: {type: DataTypes.ENUM(0,1), defaultValue: 0},
        create_time: {
        	type: DataTypes.DATE(6),
        	get: function(){
                const v = this.getDataValue('create_time');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
        	}
        },
        update_time: {
            type: DataTypes.DATE(6),
            get: function(){
                const v = this.getDataValue('update_time');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
            }
        },
        active_cnt: DataTypes.INTEGER,
        last_active_time: {
            type: DataTypes.DATE(6),
            get: function(){
                const v = this.getDataValue('last_active_time');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
            }
        }
    },{
    	tableName: 'space_admin',
    	timestamps: false
    });

    SpaceAdmin.associate = function(models){
        SpaceAdmin.belongsTo(models.Space, {as: 'space', foreignKey: 'space_id'});
    }
    return SpaceAdmin;
}