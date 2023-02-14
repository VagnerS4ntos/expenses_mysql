import type { NextApiRequest, NextApiResponse } from 'next';
const Expenses = require('../../../database/models/Expenses');

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { name, type, value, date } = req.body;
		const id = req.body.expenseId;
		await Expenses.update(
			{ name, type, value, date },
			{
				where: { id },
			},
		);
		res.json({ error: false, message: 'Expense successfully updated' });
	} catch (error) {
		res.status(400).json(error);
	}
}
