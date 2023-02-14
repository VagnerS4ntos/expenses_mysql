import React from 'react';
import { toast, TypeOptions, UpdateOptions } from 'react-toastify';
import { axiosInstance } from 'axios.config';
import { useForm, SubmitHandler } from 'react-hook-form';
import { code, email } from 'globalState/recoilState';
import { useRecoilState } from 'recoil';
import { updateToast } from 'helpers/utils';
const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function RequestResetPassword() {
	const [requesting, setRequesting] = React.useState(false);
	const [verificationCode, setVerificationCode] = useRecoilState(code);
	const [userEmail, setUserEmail] = useRecoilState(email);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ email: string }>();

	const resetPasswordRequest: SubmitHandler<{ email: string }> = async (
		userData,
	) => {
		const toastLoading = toast.loading('Please wait...');
		setRequesting(true);
		try {
			const {
				data,
			}: { data: { message: string; code: number; error: boolean } } =
				await axiosInstance.post('user/reset_password_request', {
					email: userData.email,
				});
			if (data.error) {
				toast.update(toastLoading, updateToast(data.message, 'error'));
			} else {
				setVerificationCode(data.code);
				toast.update(toastLoading, updateToast(data.message, 'success'));
				setUserEmail(userData.email);
			}
		} catch (error: any) {
			if (error instanceof Error) {
				toast.update(toastLoading, updateToast(error.message, 'error'));
			} else {
				toast.update(toastLoading, updateToast(error, 'error'));
			}
		} finally {
			setRequesting(false);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit(resetPasswordRequest)}>
				<input
					type="email"
					placeholder="E-mail"
					className="border-2 px-1 py-1 mt-1 rounded-md block w-full"
					{...register('email', { required: true, pattern: emailRegex })}
				/>
				{errors.email && <p className="text-red-500 mt-1">Invalid e-mail</p>}
				<button
					className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md mt-4 uppercase w-full"
					disabled={!!requesting}
				>
					Reset password
				</button>
			</form>
		</div>
	);
}

export default RequestResetPassword;
