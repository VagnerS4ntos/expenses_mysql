import { axiosInstance } from 'axios.config';

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

export async function getUserExpenses(id: string, year: number, month: string) {
	try {
		const response = await axiosInstance.get(`expenses/getUserExpenses/${id}`);
		const userData = response.data.sort(sortByName);
		const userExpensesByDate = filterExpenseByDate(userData, year, month);
		return userExpensesByDate;
	} catch (error: any) {
		console.log(error?.message);
		return [];
	}
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
