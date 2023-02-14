import type { NextApiRequest, NextApiResponse } from 'next';
const Users = require('../../../database/models/Users');

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { id, email } = req.body;
		await Users.update(
			{ email },
			{
				where: { id },
			},
		);
		res.status(200).json({ message: 'Email successfully changed' });
	} catch (error) {
		res.status(400).json(error);
	}
}
