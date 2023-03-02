import React from 'react';
import Link from 'next/link';
import { FaRegUserCircle } from 'react-icons/fa';
import { Path, useForm, UseFormRegister, SubmitHandler } from 'react-hook-form';
import { capitalize } from 'helpers/utils';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { axiosInstance } from 'axios.config';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-toastify';
import { updateToast } from 'helpers/utils';
const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface IFormInput {
	name: String;
	email: String;
	password: String;
	'confirm password': String;
}

type InputProps = {
	label: Path<IFormInput>;
	type: string;
	register: UseFormRegister<IFormInput>;
	validation: object;
};

const InputData = ({ label, type, register, validation }: InputProps) => (
	<>
		<label
			className="block text-lg font-medium mb-1 mt-4 capitalize"
			htmlFor={label}
		>
			{label}
		</label>
		<input
			{...register(label, validation)}
			placeholder={capitalize(label)}
			id={label}
			type={type}
			className="border border-gray-400 p-2 w-full"
		/>
	</>
);

function Signup() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<IFormInput>();
	const [loading, setLoading] = React.useState(false);
	const router = useRouter();

	const onSubmit: SubmitHandler<IFormInput> = async (userData) => {
		setLoading(true);
		const id = uuid();
		const { name, email, password } = userData;
		const toastLoading = toast.loading('Please wait...');
		try {
			const { data }: { data: { message: string; error: boolean } } =
				await axiosInstance.post('user/signup', {
					id,
					name,
					email,
					password,
				});
			if (data.error) {
				toast.update(toastLoading, updateToast(data.message, 'error'));
			} else {
				toast.dismiss(toastLoading);
				router.push('/');
			}
		} catch (error: any) {
			if (error instanceof Error) {
				toast.update(toastLoading, updateToast(error.message, 'error'));
			} else {
				toast.update(toastLoading, updateToast(error, 'error'));
			}
		} finally {
			setLoading(false);
		}
	};

	const password = watch('password');

	return (
		<main className="min-h-screen grid place-items-center p-4 max-w-sm mx-auto">
			<form
				className="bg-white text-black p-5 rounded-md w-full"
				onSubmit={handleSubmit(onSubmit)}
			>
				<FaRegUserCircle className="mx-auto text-green-500" size={60} />
				<InputData
					label="name"
					type="text"
					register={register}
					validation={{
						required: true,
						minLength: 3,
						validate: (value: string) =>
							value.replace(/\s+/g, ' ').trim().length > 2,
					}}
				/>
				{errors.name && (
					<p className="text-red-500 mt-1">
						Name must be at least 3 characters long
					</p>
				)}
				<InputData
					label="email"
					type="email"
					register={register}
					validation={{ required: true, pattern: emailRegex }}
				/>
				{errors.email && <p className="text-red-500 mt-1">Invalid e-mail</p>}
				<InputData
					label="password"
					type="password"
					register={register}
					validation={{
						required: true,
						minLength: 6,
						validate: (value: string) =>
							value.replace(/\s+/g, '').trim().length > 5,
					}}
				/>
				{errors.password && (
					<p className="text-red-500 mt-1">Password too short</p>
				)}
				<InputData
					label="confirm password"
					type="password"
					register={register}
					validation={{
						required: true,
						validate: (value: string) => value === password,
					}}
				/>
				{errors['confirm password'] && (
					<p className="text-red-500 mt-1">Passwords must be the same</p>
				)}

				<button
					className="bg-green-500 hover:bg-green-600 active:bg-green-700 text-white p-2 mt-8 mb-2 rounded-lg w-full font-semibold"
					disabled={loading}
				>
					Signup
				</button>
				<Link href="login" className="hover:text-green-600 font-semibold">
					Already have an account? Login
				</Link>
			</form>
		</main>
	);
}

export default Signup;

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
