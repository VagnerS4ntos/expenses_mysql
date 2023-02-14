import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	try {
		res.setHeader(
			'Set-Cookie',
			cookie.serialize('token', '', {
				httpOnly: true,
				secure: process.env.SERVER_ENV !== 'development',
				expires: new Date(0),
				sameSite: 'strict',
				path: '/',
			}),
		);
		res.json({ message: 'Success', error: false });
	} catch (error) {
		res.status(400).json(error);
	}
}
