import type { NextApiRequest, NextApiResponse } from 'next';
const Expenses = require('../../../database/models/Expenses');

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { id } = req.body;
		await Expenses.destroy({
			where: { id },
		});
		res.status(200).json({ message: 'Expense succesfully deleted' });
	} catch (error) {
		res.status(400).json(error);
	}
}
