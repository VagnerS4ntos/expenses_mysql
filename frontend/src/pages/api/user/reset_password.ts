import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
const Users = require('../../../database/models/Users');

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { email, password } = req.body;
		const salt = bcrypt.genSaltSync(10);
		const hashedNewPassword = bcrypt.hashSync(password, salt);

		await Users.update(
			{ password: hashedNewPassword },
			{
				where: { email },
			},
		);
		res.json({ message: 'Password successfully reseted', error: false });
	} catch (error) {
		res.status(400).json(error);
	}
}
