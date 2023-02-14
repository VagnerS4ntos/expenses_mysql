import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { axiosInstance } from 'axios.config';
import { toast } from 'react-toastify';
const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface IPassword {
	'Current password': string;
	'New password': string;
	'Repeat password': string;
}

function ChangePassword({ userId }: { userId: string }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm<IPassword>();

	const password = watch('New password');

	const changePassword: SubmitHandler<IPassword> = async (userPasswordData) => {
		try {
			const { data }: { data: { message: string } } = await axiosInstance.post(
				'user/change_password',
				{
					id: userId,
					password: userPasswordData['Current password'],
					newPassword: userPasswordData['New password'],
				},
			);
			if (data.message == 'Success!') {
				toast.success('Password successfully updated!');
				setValue('Current password', '');
				setValue('New password', '');
				setValue('Repeat password', '');
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<h2 className="uppercase text-xl mx-auto">Change password</h2>
			<form onSubmit={handleSubmit(changePassword)}>
				<label htmlFor="currentPassword" className="mt-2 block">
					Current password
				</label>
				<input
					type="password"
					id="currentPassword"
					placeholder="Current password"
					className="border-2 px-1 py-1 mt-1 rounded-md block w-full text-black"
					{...register('Current password', { required: true, minLength: 6 })}
				/>

				<label htmlFor="newPassword" className="mt-2 block">
					New password
				</label>
				<input
					type="password"
					id="newPassword"
					placeholder="New password"
					className="border-2 px-1 py-1 mt-1 rounded-md block w-full text-black"
					{...register('New password', { required: true, minLength: 6 })}
				/>
				{errors['New password'] && (
					<p className="text-red-500 mt-1">
						Password must be at least 6 characters long
					</p>
				)}

				<label htmlFor="confirmPassword" className="mt-2 block">
					Confirm new password
				</label>
				<input
					type="password"
					id="confirmPassword"
					placeholder="Repeat password"
					className="border-2 px-1 py-1 mt-1 rounded-md block w-full text-black"
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
				<button className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-md mt-4 uppercase w-full">
					Save
				</button>
				<hr className="m-10 w-full mx-auto h-1 bg-gray-500" />
			</form>
		</>
	);
}

export default ChangePassword;
