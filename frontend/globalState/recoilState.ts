import { atom } from 'recoil';
import { months, InterfaceExpense } from 'helpers/utils';

const date = new Date();
const indexMonth = new Date().getMonth();

export const yearState = atom({
	key: 'year',
	default: date.getFullYear(),
});

export const monthState = atom({
	key: 'month',
	default: months[indexMonth],
});

export const userExpensesData = atom<InterfaceExpense[]>({
	key: 'userExpensesData',
	default: [],
});

export const deletingExpense = atom({
	key: 'deletingExpense',
	default: false,
});

export const editingExpense = atom({
	key: 'editingExpense',
	default: false,
});

export const code = atom<number | null>({
	key: 'code',
	default: null,
});

export const email = atom({
	key: 'email',
	default: '',
});
