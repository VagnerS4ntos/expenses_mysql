import React from 'react';
import { userExpensesData } from 'globalState/recoilState';
import { useRecoilValue } from 'recoil';

function Balance() {
	const userExpenses = useRecoilValue(userExpensesData);
	const expense = userExpenses
		.filter((expense) => expense.type == 'expense')
		.reduce((acc, item) => {
			return acc + item.value;
		}, 0);

	const income = userExpenses
		.filter((income) => income.type == 'income')
		.reduce((acc, item) => {
			return acc + item.value;
		}, 0);

	const balance = income - expense;

	return (
		<section className="my-5 font-bold text-x max-w-xl mx-auto">
			<div className="flex bg-green-500 px-1 rounded-md p-1">
				<p className="grow">Income</p>
				<p>
					{income.toLocaleString('pt-br', {
						style: 'currency',
						currency: 'BRL',
					})}
				</p>
			</div>
			<div className="flex bg-red-500 px-1 rounded-md p-1 my-2">
				<p className="grow">Expense</p>
				<p>
					{expense.toLocaleString('pt-br', {
						style: 'currency',
						currency: 'BRL',
					})}
				</p>
			</div>
			<div
				className={`flex bg-white px-1 rounded-md p-1 ${
					balance >= 0 ? 'text-green-500' : 'text-red-500'
				}`}
			>
				<p className="grow">Balance</p>
				<p>
					{balance.toLocaleString('pt-br', {
						style: 'currency',
						currency: 'BRL',
					})}
				</p>
			</div>
		</section>
	);
}

export default Balance;
