import type { NextApiRequest, NextApiResponse } from 'next';
const Expenses = require('../../../database/models/Expenses');

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { name, type, value, date, userId } = req.body;
		await Expenses.create({
			name,
			type,
			value,
			date,
			userId,
		});
		res.status(200).json({ message: 'Expense succesfully created' });
	} catch (error) {
		res.status(400).json(error);
	}
}
