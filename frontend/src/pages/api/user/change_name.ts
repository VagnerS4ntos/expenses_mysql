import type { NextApiRequest, NextApiResponse } from 'next';
const Users = require('../../../database/models/Users');

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { id, name } = req.body;
		await Users.update(
			{ name },
			{
				where: { id },
			},
		);
		res.json({ message: 'Username successfully changed', error: false });
	} catch (error) {
		res.status(400).json(error);
	}
}
