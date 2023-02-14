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
		res.status(200).json({ message: 'Success!' });
	} catch (error) {
		res.status(400).json(error);
	}
}
