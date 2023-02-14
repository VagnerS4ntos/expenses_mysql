import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
import { axiosInstance } from 'axios.config';
import { toast } from 'react-toastify';

interface IEmail {
	'E-mail': string;
}

function ChangeEmail({ userId }: { userId: string }) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<IEmail>();

	const changeEmail: SubmitHandler<IEmail> = async (userData) => {
		try {
			const { data }: { data: { message: string; error: boolean } } =
				await axiosInstance.post('user/change_email', {
					email: userData['E-mail'].trim(),
					id: userId,
				});
			if (data.error) {
				toast.error(data.message);
			} else {
				toast.success('E-mail successfully changed!');
				setValue('E-mail', '');
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
		<>
			<h2 className="uppercase text-xl mx-auto">Change e-mail</h2>
			<form onSubmit={handleSubmit(changeEmail)}>
				<input
					type="email"
					id="email"
					placeholder="New e-mail"
					className="border-2 px-1 py-1 mt-1 rounded-md block w-full text-black"
					{...register('E-mail', { required: true, pattern: emailRegex })}
				/>
				{errors['E-mail'] && (
					<p className="text-red-500 mt-1">Invalid e-mail</p>
				)}
				<button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md mt-4 uppercase w-full">
					Save
				</button>
				<hr className="m-10 w-full mx-auto h-1 bg-gray-500" />
			</form>
		</>
	);
}

export default ChangeEmail;
