import React from 'react';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import { Path, useForm, UseFormRegister, SubmitHandler } from 'react-hook-form';
import { capitalize } from 'helpers/utils';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { axiosInstance } from 'axios.config';
import { toast } from 'react-toastify';

interface IFormInput {
	email: string;
	password: string;
}

type InputProps = {
	label: Path<IFormInput>;
	type: string;
	register: UseFormRegister<IFormInput>;
};

export const InputData = ({ label, type, register }: InputProps) => (
	<>
		<label
			className="block text-lg font-medium mb-1 mt-4 capitalize"
			htmlFor={label}
		>
			{label}
		</label>
		<input
			{...register(label, { required: true })}
			placeholder={capitalize(label)}
			id={label}
			type={type}
			className="border border-gray-400 p-2 w-full"
		/>
	</>
);

function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormInput>();
	const router = useRouter();

	const onSubmit: SubmitHandler<IFormInput> = async (loginData) => {
		const { email, password } = loginData;
		try {
			const response = await axiosInstance.post('user/login', {
				email,
				password,
			});
			if (response.status == 200) {
				router.push('/');
			} else {
				toast.error(response.data.message);
			}
		} catch (error: any) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error(error);
			}
		}
	};

	return (
		<main className="min-h-screen grid place-items-center p-4 max-w-sm mx-auto">
			<form
				className="bg-white text-black p-5 rounded-md w-full"
				onSubmit={handleSubmit(onSubmit)}
			>
				<FaUserCircle className="mx-auto text-green-500" size={60} />
				<InputData label="email" type="mail" register={register} />
				{errors.email && <p className="text-red-500 mt-1">Invalid e-mail</p>}
				<InputData label="password" type="password" register={register} />
				{errors.password && (
					<p className="text-red-500 mt-1">Invalid password</p>
				)}

				<button
					className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white p-2 mt-8 mb-2 rounded-lg  w-full font-semibold"
					type="submit"
				>
					Login
				</button>
				<Link
					href="signup"
					className="block my-2 hover:text-green-600 font-semibold"
				>
					Don't have an account yet? Sign up
				</Link>
				<Link
					href="resetPassword"
					className="hover:text-green-600 font-semibold"
				>
					Forgot your password? Reset
				</Link>
			</form>
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
