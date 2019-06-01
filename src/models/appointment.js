import date from '../utils/date';

export default function(sequelize, DataTypes){
	const Appointment = sequelize.define("Appointment", {
        space_id: DataTypes.INTEGER,
        space_name: DataTypes.STRING,
        contact_name: DataTypes.STRING,
        contact_phone: DataTypes.STRING,
        purpose: {type: DataTypes.ENUM(0,1,2,3,4), defaultValue: 0},
        user_id: DataTypes.INTEGER,
        appoint_time: {
        	type: DataTypes.DATE(6),
        	get: function(){
                const v = this.getDataValue('appoint_time');
                return v ? v.format('yyyy-MM-dd') : undefined;
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
    	tableName: 'appointment',
    	timestamps: false
    });

    // Appointment.associate = function(models){
    //     Appointment.belongsTo(models.Space, {as: 'space', foreignKey: 'space_id'});
    // }
    return Appointment;
}