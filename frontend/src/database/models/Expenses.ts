import { DataTypes } from 'sequelize';
const db = require('../connection/db');

const Expenses = db.define('expenses_control', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	type: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	value: {
		type: DataTypes.INTEGER,
	},
	name: {
		type: DataTypes.STRING,
	},
	date: {
		type: DataTypes.STRING,
	},
	userId: {
		type: DataTypes.STRING,
	},
});

module.exports = Expenses;
