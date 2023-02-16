import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import cookie from 'cookie';
const Users = require('../../../database/models/Users');
const jwt = require('jsonwebtoken');

export interface IUsers {
	id: string;
	name: string;
	email: string;
	password: string;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const email = req.body.email;
		const password = req.body.password;

		const user: IUsers = await Users.findOne({ where: { email } });
		if (user) {
			const passwordMatch = bcrypt.compareSync(password, user.password);
			if (passwordMatch) {
				const payload = {
					id: user.id,
					name: user.name,
				};
				const token = jwt.sign(payload, process.env.JWT_SECRET, {
					expiresIn: '30 minutes',
				});
				res.setHeader(
					'Set-Cookie',
					cookie.serialize('token', token, {
						httpOnly: true,
						secure: process.env.SERVER_ENV !== 'development',
						maxAge: 1800,
						sameSite: 'strict',
						path: '/',
					}),
				);

				res.json({ message: 'Success', error: false });
			} else {
				res.json({ message: 'Invalid Credentials', error: true });
			}
		} else {
			res.json({ message: 'Invalid Credentials', error: true });
		}
	} catch (error) {
		res.status(400).json(error);
	}
}
