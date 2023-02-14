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
	createdAt: Date;
	updatedAt: Date;
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

				res.status(200).json({ message: 'Success' });
			} else {
				res.status(404).json({ error: true, message: 'Invalid Credentials' });
			}
		} else {
			res.status(404).json({ message: 'Invalid Credentials' });
		}
	} catch (error) {
		res.status(400).json(error);
	}
}
