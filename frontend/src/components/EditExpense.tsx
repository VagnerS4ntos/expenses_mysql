import React from 'react';
import {
	yearState,
	monthState,
	userExpensesData,
	editingExpense,
} from 'globalState/recoilState';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useForm, SubmitHandler } from 'react-hook-form';
import { axiosInstance } from 'axios.config';
import { InterfaceExpense, getUserExpenses } from '../../helpers/utils';
import { toast } from 'react-toastify';

interface InterfaceNewExpense {
	name: string;
	type: string;
	value: number;
	expenseId: string;
	date: Date | string;
}

function EditExpense({
	userId,
	expenseData,
}: {
	userId: string;
	expenseData: InterfaceExpense | null;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<InterfaceNewExpense>({
		defaultValues: {
			name: expenseData?.name,
			type: expenseData?.type,
			value: expenseData?.value,
			date: expenseData?.date,
		},
	});
	const [editExpenseWindow, setEditExpenseWindow] =
		useRecoilState(editingExpense);
	const [userExpenses, setUserExpenses] = useRecoilState(userExpensesData);
	const year = useRecoilValue(yearState);
	const month = useRecoilValue(monthState);

	function closeThisWindow(event: React.MouseEvent<HTMLElement>) {
		if ((event.target as HTMLElement).dataset.function === 'close') {
			setEditExpenseWindow(false);
		}
	}

	const onSubmit: SubmitHandler<InterfaceNewExpense> = async (
		editExpenseData,
	) => {
		editExpenseData.expenseId = expenseData!.id;
		try {
			const response = await axiosInstance.post(
				'expenses/editExpense',
				editExpenseData,
			);
			if (response.status == 200) {
				getUserExpenses(userId, year, month).then((data) =>
					setUserExpenses(data),
				);
				toast.success(response.data.message);
				setEditExpenseWindow(false);
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
		<section
			className="bg-black absolute w-screen h-screen top-0 left-0 grid place-items-center bg-opacity-80 px-4"
			data-function="close"
			onClick={closeThisWindow}
		>
			<div className="bg-white text-black rounded-md w-full sm:w-96 overflow-hidden">
				<h1 className="bg-blue-500 text-white uppercase p-4">Edit expense</h1>
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
							{...register('name', { required: true })}
						/>
						{errors.name && <p className="text-red-500 mt-1">Invalid name</p>}
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
						{errors.type && (
							<p className="text-red-500 mt-1">You need to select a type</p>
						)}
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
						<button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md grow">
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
	);
}

export default EditExpense;
