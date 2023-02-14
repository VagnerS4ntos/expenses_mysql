import { axiosInstance } from 'axios.config';
import { TypeOptions, UpdateOptions } from 'react-toastify';

export const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

export function capitalize(word: string) {
	const splitWord = word.toLowerCase().split(' ');
	for (let i = 0; i < splitWord.length; i++) {
		{
			if (splitWord[i].length > 2) {
				splitWord[i] =
					splitWord[i][0].toUpperCase() + splitWord[i].substring(1);
			}
		}
	}
	return splitWord.join(' ');
}

export function sortByName(a: InterfaceExpense, b: InterfaceExpense) {
	return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}

export function getDayYearMonth(date: String) {
	const [year, month, day] = date.split('-');
	return { day, month, year };
}

export function filterExpenseByDate(
	array: InterfaceExpense[],
	selectedYear: number,
	selectedMonth: string,
) {
	const indexMonth = months.indexOf(selectedMonth);
	const expensesFiltered = array.filter(
		(item) =>
			parseInt(getDayYearMonth(item.date).month) == indexMonth + 1 &&
			getDayYearMonth(item.date).year == String(selectedYear),
	);
	return expensesFiltered;
}

// export async function getExpenseByDate(
// 	id: string,
// 	year: number,
// 	month: string,
// ) {
// 	try {
// 		const { data }: { data: InterfaceExpense[] } = await axiosInstance.get(
// 			`expenses/getUserExpenses/${id}`,
// 		);
// 		const userData = data.sort(sortByName);
// 		const userExpensesByDate = filterExpenseByDate(userData, year, month);
// 		return userExpensesByDate;
// 	} catch (error: any) {
// 		console.log(error?.message);
// 		return [];
// 	}
// }

export function getExpenseByDate(
	userData: InterfaceExpense[],
	year: number,
	month: string,
) {
	try {
		const userExpensesByDate = filterExpenseByDate(userData, year, month);
		return userExpensesByDate;
	} catch (error: any) {
		console.log(error?.message);
		return [];
	}
}

export async function getAllUserExpenses(id: string) {
	try {
		const { data }: { data: InterfaceExpense[] } = await axiosInstance.get(
			`expenses/getUserExpenses/${id}`,
		);
		const userData = data.sort(sortByName);
		return userData;
	} catch (error: any) {
		console.log(error?.message);
		return [];
	}
}

export function updateToast(
	message: string,
	type: TypeOptions,
): UpdateOptions<unknown> {
	return {
		render: message,
		type: type,
		isLoading: false,
		autoClose: 3000,
		closeButton: true,
	};
}

export interface InterfaceExpense {
	id: string;
	name: string;
	type: string;
	value: number;
	date: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}
