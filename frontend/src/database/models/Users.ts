import { DataTypes } from 'sequelize';
const db = require('../connection/db');

const User = db.define('users', {
	id: {
		type: DataTypes.STRING,
		allowNull: false,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

module.exports = User;
