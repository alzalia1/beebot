const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Sanctions = sequelize.define('Sanctions', {
	case_id: {
		type: DataTypes.STRING,
		unique: true,
	},
	type: DataTypes.TEXT,
	user_id: DataTypes.STRING,
	duration: DataTypes.INTEGER,
	moderator_id: DataTypes.STRING,
	reason: DataTypes.TEXT,
	state: DataTypes.STRING,
	// usage_count: {
	// 	type: Sequelize.INTEGER,
	// 	defaultValue: 0,
	// 	allowNull: false,
	// },
}, {
	freezeTableName: true
  });

module.exports = Sanctions;