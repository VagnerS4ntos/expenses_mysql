import type { NextApiRequest, NextApiResponse } from 'next';
const Users = require('../../../database/models/Users');

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { id, email } = req.body;
		const checkedEmail = await Users.findOne({
			where: { email: email.toLowerCase() },
			raw: true,
		});
		if (checkedEmail) {
			res.json({ message: 'Email already in use', error: true });
		} else {
			await Users.update(
				{ email },
				{
					where: { id },
				},
			);
			res.json({ message: 'Email successfully changed', error: false });
		}
	} catch (error) {
		res.status(400).json(error);
	}
}
