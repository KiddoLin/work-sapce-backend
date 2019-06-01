import date from '../utils/date';

export default function(sequelize, DataTypes){
	const User = sequelize.define("User", {
        nickname: DataTypes.STRING,
        username: DataTypes.STRING,
        type: DataTypes.INTEGER,
        telephone: DataTypes.STRING,
        industry_id: DataTypes.INTEGER,
        status: {type: DataTypes.ENUM(0,1), defaultValue: 0},
        scene: DataTypes.STRING,
        tags: DataTypes.STRING,
        create_time: {
        	type: DataTypes.DATE(6),
        	get: function(){
                const v = this.getDataValue('create_time');
                return v ? v.format('yyyy-MM-dd hh:mm:ss') : undefined;
        	}
        }
    },{
    	tableName: 'user',
    	timestamps: false
    });

    User.associate = function(models){
        User.belongsTo(models.Space, {as: 'space', foreignKey: 'space_id'});
    }
    return User;
}