import React from 'react';
import { axiosInstance } from 'axios.config';
import {
	yearState,
	monthState,
	userExpensesData,
	allExpenses,
	deletingExpense,
} from 'globalState/recoilState';
import { getExpenseByDate, getAllUserExpenses } from 'helpers/utils';
import { useRecoilState, useRecoilValue } from 'recoil';
import { toast } from 'react-toastify';

function DeleteExpense({
	expenseId,
	userId,
}: {
	expenseId: string;
	userId: string;
}) {
	const [deleteExpenseWindow, setDeleteExpenseWindow] =
		useRecoilState(deletingExpense);
	const year = useRecoilValue(yearState);
	const month = useRecoilValue(monthState);
	const [userExpenses, setUserExpenses] = useRecoilState(userExpensesData);
	const [allUserExpenses, setAllUserExpenses] = useRecoilState(allExpenses);

	function closeThisWindow(event: React.MouseEvent<HTMLElement>) {
		if ((event.target as HTMLElement).dataset.function === 'close') {
			setDeleteExpenseWindow(false);
		}
	}

	async function deleteExpense() {
		try {
			const response = await axiosInstance.post('expenses/deleteExpense', {
				id: expenseId,
			});
			if (response.status == 200) {
				getAllUserExpenses(userId).then((response) => {
					setAllUserExpenses(response);
					const renderData = getExpenseByDate(response, year, month);
					setUserExpenses(renderData);
				});
				toast.success(response.data.message);
				setDeleteExpenseWindow(false);
			}
		} catch (error: any) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error(error);
			}
		}
	}

	return (
		<section
			className="bg-black absolute w-screen h-screen top-0 left-0 grid place-items-center bg-opacity-80 px-4"
			data-function="close"
			onClick={closeThisWindow}
		>
			<div className="bg-white text-black rounded-md w-full sm:w-96 overflow-hidden">
				<h1 className="bg-red-500 text-white uppercase p-4">Delete expense</h1>
				<div className="flex flex-col gap-4 p-4">
					<h2>Are you sure you wanna delete this expense?</h2>
					<div className="flex gap-2 mt-2">
						<button
							className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md grow"
							onClick={deleteExpense}
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
	);
}

export default DeleteExpense;
