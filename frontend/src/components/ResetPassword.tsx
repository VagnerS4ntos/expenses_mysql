import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { code, email } from 'globalState/recoilState';
import { useRecoilState } from 'recoil';
import { toast } from 'react-toastify';
import { axiosInstance } from 'axios.config';
import { useRouter } from 'next/router';

function ResetPassword() {
	const [verificationCode, setVerificationCode] = useRecoilState(code);
	const [userEmail, setUserEmail] = useRecoilState(email);
	const router = useRouter();
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<IuserData>();
	const password = watch('Password');

	const resetPassword: SubmitHandler<IuserData> = async (userData) => {
		if (Number(userData.Code) != verificationCode) {
			toast.error('Invalid code. Try again!');
			setVerificationCode(null);
		} else {
			try {
				const response = await axiosInstance.post('user/reset_password', {
					email: userEmail,
					password: userData.Password,
				});
				if (response.status == 200) {
					toast.success(response.data.message);
					router.push('/login');
				} else {
					toast.error(response.data.message);
				}
			} catch (error: any) {
				toast.error(error);
			} finally {
				setVerificationCode(null);
				setUserEmail('');
			}
		}
	};

	return (
		<form
			onSubmit={handleSubmit(resetPassword)}
			className="w-full md:max-w-xl mx-auto text-black"
		>
			<label htmlFor="code" className="text-white mt-2 block">
				Verification code (check your e-mail)
			</label>
			<input
				type="number"
				id="code"
				placeholder="Code"
				className="border-2 px-1 py-1 mt-1 rounded-md block w-full"
				{...register('Code', {
					required: true,
				})}
			/>
			{errors['Code'] && <p className="text-red-500 mt-1">Invalid code</p>}

			<label htmlFor="newPassword" className="text-white mt-2 block">
				New password
			</label>
			<input
				type="password"
				id="newPassword"
				placeholder="New password"
				className="border-2 px-1 py-1 mt-1 rounded-md block w-full"
				{...register('Password', { required: true, minLength: 6 })}
			/>
			{errors['Password'] && (
				<p className="text-red-500 mt-1">
					Password must be at least 6 characters long
				</p>
			)}

			<label htmlFor="confirmPassword" className="text-white mt-2 block">
				Confirm new password
			</label>
			<input
				type="password"
				id="confirmPassword"
				placeholder="Repeat password"
				className="border-2 px-1 py-1 mt-1 rounded-md block w-full"
				{...register('Repeat password', {
					required: true,
					validate: (value: string) => value === password,
				})}
			/>
			{errors['Repeat password'] && (
				<p className="text-red-500 mt-1">
					This field must be the same as the new password field
				</p>
			)}
			<button className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md mt-4 uppercase w-full">
				Reset password
			</button>
		</form>
	);
}

export default ResetPassword;

interface IuserData {
	Code: string;
	Password: string;
	'Repeat password': string;
}
