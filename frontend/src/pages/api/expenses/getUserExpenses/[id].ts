import type { NextApiRequest, NextApiResponse } from 'next';
const Expenses = require('../../../../database/models/Expenses');

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { id } = req.query;

		const userExpenses: InterfaceExpense[] = await Expenses.findAll({
			where: { userId: id },
			raw: true,
		});
		res.json(userExpenses);
	} catch (error) {
		res.status(400).json(error);
	}
}

interface InterfaceExpense {
	name: string;
	type: string;
	value: number;
	date: string;
	id: number;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}
