import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { axiosInstance } from 'axios.config';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
	yearState,
	monthState,
	userExpensesData,
	allExpenses,
} from 'globalState/recoilState';
import { getExpenseByDate, getAllUserExpenses } from 'helpers/utils';
import { toast } from 'react-toastify';

function NewExpense({ userId }: { userId: string }) {
	const [addExpense, setAddExpense] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const year = useRecoilValue(yearState);
	const month = useRecoilValue(monthState);
	const [userExpenses, setUserExpenses] = useRecoilState(userExpensesData);
	const [allUserExpenses, setAllUserExpenses] = useRecoilState(allExpenses);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<INewExpense>();

	function closeThisWindow(event: React.MouseEvent<HTMLElement>) {
		if ((event.target as HTMLElement).dataset.function === 'close') {
			setAddExpense(false);
			reset();
		}
	}

	const onSubmit: SubmitHandler<INewExpense> = async (newExpenseData) => {
		setLoading(true);
		newExpenseData.userId = userId;
		try {
			const response = await axiosInstance.post(
				'expenses/addExpense',
				newExpenseData,
			);
			if (response.status == 200) {
				getAllUserExpenses(userId).then((response) => {
					setAllUserExpenses(response);
					const renderData = getExpenseByDate(response, year, month);
					setUserExpenses(renderData);
				});
				toast.success(response.data.message);
				setAddExpense(false);
				reset();
			}
		} catch (error: any) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error(error);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<section className="max-w-xl mx-auto">
			<button
				className="bg-green-600 hover:bg-green-700 active:bg-green-800 px-2 py-1 rounded-md mb-5 uppercase"
				onClick={() => setAddExpense(true)}
			>
				New expense
			</button>
			{addExpense && (
				<section
					className="bg-black fixed w-screen h-screen top-0 left-0 grid place-items-center bg-opacity-80 px-4"
					data-function="close"
					onClick={closeThisWindow}
				>
					<div className="bg-white text-black rounded-md w-full sm:w-96 overflow-hidden">
						<h1 className="bg-green-500 text-white uppercase p-4">
							New expense
						</h1>
						<form
							className="flex flex-col gap-4 p-4"
							onSubmit={handleSubmit(onSubmit)}
						>
							<div>
								<label htmlFor="name">Name</label>
								<input
									type="text"
									id="name"
									placeholder="Name"
									className="border-2 px-1 py-1 mt-1 rounded-md block w-full"
									{...register('name', { required: true, minLength: 2 })}
								/>
								{errors.name && (
									<p className="text-red-500 mt-1">Invalid name</p>
								)}
							</div>
							<div>
								<label>Type</label>
								<select
									className="border-2 px-1 py-1 mt-1 rounded-md block w-full"
									{...register('type')}
								>
									<option value="income">Income</option>
									<option value="expense">Expense</option>
								</select>
							</div>
							<div>
								<label htmlFor="value">Value</label>
								<input
									type="number"
									id="value"
									min={0}
									placeholder="Value"
									className="border-2 px-1 py-1 mt-1 rounded-md block w-full"
									{...register('value', { required: true, min: 0.01 })}
								/>
								{errors.value && (
									<p className="text-red-500 mt-1">
										The value must be greater than zero
									</p>
								)}
							</div>
							<div>
								<label htmlFor="date">Date</label>
								<input
									type="date"
									id="date"
									className="text-black border-2 px-1 py-1 mt-1 rounded-md block w-full"
									{...register('date', { required: true })}
								/>
								{errors.date && (
									<p className="text-red-500 mt-1">You need to select a date</p>
								)}
							</div>
							<div className="flex gap-2 mt-2">
								<button
									className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md grow"
									disabled={loading}
								>
									Save
								</button>
								<button
									className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded-md grow"
									data-function="close"
									type="button"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</section>
			)}
		</section>
	);
}

export default NewExpense;

interface INewExpense {
	date: Date;
	name: string;
	type: string;
	value: number;
	userId: string;
}
