import type { NextApiRequest, NextApiResponse } from 'next';
const Users = require('../../../database/models/Users');
const Expenses = require('../../../database/models/Expenses');
import cookie from 'cookie';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { id } = req.body;
		await Users.destroy({
			where: { id },
		});

		await Expenses.destroy({
			where: { userId: id },
		});

		res.setHeader(
			'Set-Cookie',
			cookie.serialize('token', '', {
				httpOnly: true,
				secure: process.env.SERVER_ENV !== 'development',
				expires: new Date(0),
				sameSite: 'strict',
				path: '/',
			}),
		);
		res.json({ message: 'Account successfully deleted', error: false });
	} catch (error) {
		res.status(400).json(error);
	}
}
