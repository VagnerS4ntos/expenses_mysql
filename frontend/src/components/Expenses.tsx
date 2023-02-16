import React from 'react';
import {
	getExpenseByDate,
	getDayYearMonth,
	sortByName,
	InterfaceExpense,
} from 'helpers/utils';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
	yearState,
	monthState,
	userExpensesData,
	allExpenses,
	deletingExpense,
	editingExpense,
} from 'globalState/recoilState';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import DeleteExpense from './DeleteExpense';
import EditExpense from './EditExpense';

/* */
import useSWR from 'swr';
import { axiosInstance } from 'axios.config';
/* */

function Expenses({ userId }: { userId: string }) {
	const year = useRecoilValue(yearState);
	const month = useRecoilValue(monthState);
	const [userExpenses, setUserExpenses] = useRecoilState(userExpensesData);
	const [allUserExpenses, setAllUserExpenses] = useRecoilState(allExpenses);
	const [deleteExpenseWindow, setDeleteExpenseWindow] =
		useRecoilState(deletingExpense);
	const [editExpenseWindow, setEditExpenseWindow] =
		useRecoilState(editingExpense);
	const [deleteExpenseId, setDeleteExpenseId] = React.useState('');
	const [editExpenseData, setEditExpenseData] =
		React.useState<InterfaceExpense | null>(null);
	const [firstRender, setFirstRender] = React.useState(true);

	const { error, isLoading } = useSWR<InterfaceExpense[]>(
		`expenses/getUserExpenses/${userId}`,
		(url: string) =>
			axiosInstance(url).then(({ data }: { data: InterfaceExpense[] }) => {
				const sortedByName = data.sort(sortByName);
				setAllUserExpenses(sortedByName);
				const renderData = getExpenseByDate(data, year, month);
				setUserExpenses(renderData);
				return sortedByName;
			}),
	);

	React.useEffect(() => {
		if (!firstRender) {
			const data = getExpenseByDate(allUserExpenses, year, month);
			setUserExpenses(data);
		}
		setFirstRender(false);
	}, [year, month]);

	function openDeleteExpenseWindow(event: React.MouseEvent<SVGElement>) {
		setDeleteExpenseId(event.currentTarget.dataset.id as string);
		setDeleteExpenseWindow(true);
	}

	function openEditExpenseWindow(event: React.MouseEvent<SVGElement>) {
		const [currentExpense] = userExpenses.filter(
			(expense) => expense.id == event.currentTarget.dataset.id,
		);
		setEditExpenseData(currentExpense);
		setEditExpenseWindow(true);
	}

	if (error) {
		return (
			<h1 className="text-2xl mt-5 max-w-xl mx-auto">Something is wrong...</h1>
		);
	}

	if (isLoading) {
		return <h1 className="text-2xl mt-5 max-w-xl mx-auto">Loading...</h1>;
	}

	return (
		<section className="max-w-xl mx-auto">
			{deleteExpenseWindow && (
				<DeleteExpense userId={userId} expenseId={deleteExpenseId} />
			)}

			{editExpenseWindow && (
				<EditExpense userId={userId} expenseData={editExpenseData} />
			)}

			{userExpenses.length ? (
				<table className="mt-5 w-full border-2">
					<thead className="p-2 bg-gray-600">
						<tr className="text-left uppercase">
							<th className="p-2">Name</th>
							<th className="p-2 w-32">Value</th>
							<th className="p-2 w-28 text-center">Date</th>
							<th className="w-24 text-center">Actions</th>
						</tr>
					</thead>
					<tbody className="font-bold">
						{userExpenses.map((expense, index) => (
							<tr
								key={expense.id}
								className={`py-2 text-black ${
									index % 2 == 0 ? 'bg-gray-50' : 'text-white'
								}`}
							>
								<td className="px-2 py-1">{expense.name}</td>
								<td
									className={`px-2 ${
										expense.type == 'income' ? 'text-green-600' : 'text-red-600'
									}`}
								>
									{expense.value.toLocaleString('pt-br', {
										style: 'currency',
										currency: 'BRL',
									})}
								</td>
								<td className="px-2 text-center">
									{`${getDayYearMonth(expense.date).day}/${
										getDayYearMonth(expense.date).month
									}`}
								</td>
								<td className="px-2 py-1 text-center">
									<div className="flex items-center justify-center gap-3">
										<AiFillDelete
											size={22}
											className="cursor-pointer hover:text-red-500"
											title="Delete expense"
											data-id={expense.id}
											onClick={openDeleteExpenseWindow}
										/>
										|
										<AiFillEdit
											size={22}
											className="cursor-pointer hover:text-blue-500"
											title="Edit expense"
											data-id={expense.id}
											onClick={openEditExpenseWindow}
										/>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<h1 className="text-2xl mt-5">No data found</h1>
			)}
		</section>
	);
}

export default Expenses;
