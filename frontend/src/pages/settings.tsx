import React from 'react';
import { GetServerSidePropsContext } from 'next';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import Header from '@/components/Header';
import { userNameState } from 'globalState/recoilState';
import { useRecoilState } from 'recoil';
import ChangeUsername from '@/components/ChangeUserName';
import ChangeEmail from '@/components/ChangeEmail';
import ChangePassword from '@/components/ChangeUserPassword';

function settings({ id, name }: { id: string; name: string }) {
	const [userName, setUserName] = useRecoilState(userNameState);

	React.useEffect(() => {
		setUserName(name);
	}, []);

	return (
		<>
			<Header />
			<main className="max-w-xl mx-auto px-4">
				<ChangeUsername userId={id} />
				<ChangeEmail userId={id} />
				<ChangePassword userId={id} />
			</main>
		</>
	);
}

export default settings;

export const getServerSideProps = async (
	context: GetServerSidePropsContext,
) => {
	try {
		const token = context.req.cookies['token'];
		if (token) {
			const secret = process.env.JWT_SECRET as Secret;
			const decoded = jwt.verify(token, secret) as JwtPayload;
			const { exp } = decoded;
			if (exp && exp > Date.now() / 1000) {
				return {
					props: { id: decoded.id, name: decoded.name },
				};
			} else {
				return {
					redirect: {
						destination: '/login',
						permanent: false,
					},
				};
			}
		} else {
			return {
				redirect: {
					destination: '/login',
					permanent: false,
				},
			};
		}
	} catch (error: any) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}
};
