import type { NextApiRequest, NextApiResponse } from 'next';
const Users = require('../../../database/models/Users');
const nodemailer = require('nodemailer');
const SMTP_CONFIG = require('../../../emailConfig/smtp');

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		const { email } = req.body;

		const checkIfUserExists = await Users.findOne({
			where: { email },
			raw: true,
		});
		if (!checkIfUserExists) {
			res.json({
				message: 'This email does not exist in our database',
				error: true,
			});
		} else {
			const code = Math.floor(Math.random() * 9000) + 1000;

			const transporter = nodemailer.createTransport({
				host: SMTP_CONFIG.host,
				port: SMTP_CONFIG.port,
				secure: false,
				auth: {
					user: SMTP_CONFIG.user,
					pass: SMTP_CONFIG.pass,
				},
				tls: {
					rejectUnauthorized: false,
				},
			});

			const message = {
				from: 'vagner.dev.fullstack@gmail.com',
				to: email,
				subject: 'Reset password',
				html: `<div>
            <h1>Password recovery requested</h1>
            <h2>Please use the following verification code: ${code}</h2>
          </div>`,
			};

			transporter.sendMail(message, (error: any) => {
				if (error) {
					res.json({ message: error, error: true });
				} else {
					res.json({
						message: 'Check your email inbox',
						code,
						error: false,
					});
				}
			});
		}
	} catch (error) {
		res.status(400).json(error);
	}
}
