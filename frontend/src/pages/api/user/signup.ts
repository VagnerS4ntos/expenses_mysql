import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import bcrypt from 'bcrypt';
import { IUsers } from './login';
import { capitalize } from 'helpers/utils';
const jwt = require('jsonwebtoken');
const Users = require('../../../database/models/Users');

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { id, name, email, password } = req.body;
		const checkedEmail = await Users.findOne({
			where: { email: email.toLowerCase() },
			raw: true,
		});

		if (checkedEmail) {
			res.status(409).json({ message: 'E-mail already in use' });
		} else {
			const salt = bcrypt.genSaltSync(10);
			const hashedPassword = bcrypt.hashSync(password, salt);
			const userCreated: IUsers = await Users.create({
				id,
				name: capitalize(name),
				email: email.toLowerCase(),
				password: hashedPassword,
			});
			if (userCreated) {
				const payload = {
					id: userCreated.id,
					name: userCreated.name,
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

				res.status(200).json({
					message: 'Success',
				});
			} else {
				res.status(400).json({
					error: true,
					message: 'Something is wrong',
				});
			}
		}
	} catch (error) {
		res.status(400).json(error);
	}
}
