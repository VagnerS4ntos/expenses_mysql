import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { axiosInstance } from 'axios.config';
import { toast } from 'react-toastify';
import { HiExclamationTriangle } from 'react-icons/hi2';
import { useRouter } from 'next/router';

interface IName {
	'Current password': string;
}

function DeleteAccount({ userId }: { userId: string }) {
	const [deleteAccConfirmation, setDeleteAccConfirmation] =
		React.useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		setError,
		setValue,
		formState: { errors },
	} = useForm<IName>();

	const openDeleteAccConfirmWindow: SubmitHandler<IName> = async (userData) => {
		try {
			const { data }: { data: { message: string; error: boolean } } =
				await axiosInstance.post('user/check_password', {
					id: userId,
					password: userData['Current password'],
				});
			if (data.error) {
				setError('Current password', { message: data.message });
			} else {
				setDeleteAccConfirmation(true);
				setValue('Current password', '');
			}
		} catch (error: any) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error(error);
			}
		}
	};

	async function deleteAccount() {
		try {
			const { data }: { data: { message: string; error: boolean } } =
				await axiosInstance.post('user/delete_account', { id: userId });
			if (!data.error) {
				router.push('/login');
				toast.success('Account successfully deleted');
			}
		} catch (error: any) {
			toast.error(error);
		}
	}

	function closeThisWindow(event: React.MouseEvent<HTMLElement>) {
		if ((event.target as HTMLElement).dataset.function === 'close') {
			setDeleteAccConfirmation(false);
		}
	}

	return (
		<>
			<h2 className="uppercase text-xl mx-auto">Delete account</h2>
			<form
				onSubmit={handleSubmit(openDeleteAccConfirmWindow)}
				className="mb-5"
			>
				<label htmlFor="accPassword" className="mt-2 block">
					Current password
				</label>
				<input
					type="password"
					id="accPassword"
					placeholder="Current password"
					className="border-2 px-1 py-1 mt-1 rounded-md block w-full text-black"
					{...register('Current password')}
				/>

				<p className="text-red-500 mt-1">
					{errors['Current password']?.message}
				</p>

				<button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md mt-4 uppercase w-full">
					Save
				</button>
			</form>

			{deleteAccConfirmation && (
				<section
					className="bg-black absolute w-screen h-screen top-0 left-0 grid place-items-center bg-opacity-80 px-4"
					data-function="close"
					onClick={closeThisWindow}
				>
					<div className="bg-white text-black rounded-md w-full sm:w-96 overflow-hidden">
						<h1 className="bg-red-500 text-white uppercase p-4 flex items-center gap-2">
							<HiExclamationTriangle className="inline-block" size="1.5rem" />
							Delete account
						</h1>
						<div className="flex flex-col gap-4 p-4">
							<h2>
								Are you sure you wanna delete your account? This can't be
								undone!
							</h2>
							<div className="flex gap-2 mt-2">
								<button
									className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md grow"
									onClick={deleteAccount}
								>
									Yes
								</button>
								<button
									className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md grow"
									data-function="close"
								>
									No
								</button>
							</div>
						</div>
					</div>
				</section>
			)}
		</>
	);
}

export default DeleteAccount;
