import React from 'react';
import { GetServerSidePropsContext } from 'next';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import RequestResetPassword from '@/components/RequestResetPassword';
import ResetPassword from '@/components/ResetPassword';
import { code } from 'globalState/recoilState';
import { useRecoilState } from 'recoil';
import { useRouter } from 'next/router';

function Login() {
	const [verificationCode, setVerificationCode] = useRecoilState(code);
	const router = useRouter();

	return (
		<main className="h-screen grid place-items-center px-4">
			<section className="w-full md:max-w-xl mx-auto text-black">
				{verificationCode ? <ResetPassword /> : <RequestResetPassword />}
				<div className="text-white mt-5 flex gap-5 uppercase text-center">
					<button
						className="px-2 py-1 rounded-md grow border-white border bg-black hover:bg-white hover:text-black"
						onClick={() => {
							setVerificationCode(null);
							router.push('/login');
						}}
					>
						Login page
					</button>
					<button
						className="px-2 py-1 rounded-md grow border-white border bg-black hover:bg-white hover:text-black"
						onClick={() => {
							setVerificationCode(null);
							router.push('/signup');
						}}
					>
						Signup page
					</button>
				</div>
			</section>
		</main>
	);
}

export default Login;

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
					redirect: {
						destination: '/',
						permanent: false,
					},
					props: { id: decoded.id, name: decoded.name },
				};
			}
		}
		return {
			props: {},
		};
	} catch (error: any) {
		return {
			props: {},
		};
	}
};
