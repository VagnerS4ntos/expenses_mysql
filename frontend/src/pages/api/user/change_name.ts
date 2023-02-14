import type { NextApiRequest, NextApiResponse } from 'next';
const Users = require('../../../database/models/Users');

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { id, name } = req.body;
		const userUpdated = await Users.update(
			{ name },
			{
				where: { id },
			},
		);
		if (userUpdated[0]) {
			res.status(200).json({ message: 'Success!' });
		} else {
			res.status(400).json({ message: 'Something is wrong. Try again' });
		}
	} catch (error) {
		res.status(400).json(error);
	}
}
