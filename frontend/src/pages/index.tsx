import React from 'react';
import Header from '@/components/Header';
import NewExpense from '@/components/NewExpense';
import Balance from '@/components/BalanceSheet';
import SelectDate from '@/components/SelectDate';
import Expenses from '@/components/Expenses';
import { GetServerSidePropsContext } from 'next';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

export default function Home({ id, name }: { id: string; name: string }) {
	return (
		<>
			<Header userName={name} />
			<main className="container">
				<NewExpense userId={id} />
				<Balance />
				<SelectDate />
				<Expenses userId={id} />
			</main>
		</>
	);
}

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
