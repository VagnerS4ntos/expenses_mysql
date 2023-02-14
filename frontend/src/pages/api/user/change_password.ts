import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { IUsers } from './login';
const Users = require('../../../database/models/Users');

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { id, password, newPassword } = req.body;
		const user: IUsers = await Users.findOne({ where: { id } });

		const passwordMatch = await bcrypt.compareSync(password, user.password);
		if (passwordMatch) {
			const salt = bcrypt.genSaltSync(10);
			const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

			await Users.update(
				{ password: hashedNewPassword },
				{
					where: { id },
				},
			);
			res.json({ message: 'Success!' });
		} else {
			res.json({ message: 'Current password is incorrect!' });
		}
	} catch (error) {
		res.status(400).json(error);
	}
}
