import type { NextApiRequest, NextApiResponse } from 'next';
import { IUsers } from './login';
import bcrypt from 'bcrypt';
const Users = require('../../../database/models/Users');

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { password, id } = req.body;
		const user: IUsers = await Users.findOne({ where: { id } });
		if (user) {
			const passwordMatch = bcrypt.compareSync(password, user.password);
			if (passwordMatch) {
				res.json({ message: 'Success', error: false });
			} else {
				res.json({ message: 'Wrong password', error: true });
			}
		}
	} catch (error) {
		res.status(400).json(error);
	}
}
