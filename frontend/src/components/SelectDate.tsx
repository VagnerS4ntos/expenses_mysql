import React from 'react';
import { useRecoilState } from 'recoil';
import { months } from '../../helpers/utils';
import { yearState, monthState } from 'globalState/recoilState';

function SelectDate() {
	const [year, setYear] = useRecoilState(yearState);
	const [month, setMonth] = useRecoilState(monthState);

	return (
		<div className="flex gap-4 justify-between max-w-xl mx-auto">
			<div className="grow">
				<label className="block uppercase">Year</label>
				<select
					className="text-black rounded-md px-2 py-1 w-full"
					value={year}
					onChange={({ target }) => setYear(Number(target.value))}
				>
					{years.map((year) => (
						<option key={year} value={year}>
							{year}
						</option>
					))}
				</select>
			</div>

			<div className="grow">
				<label className="block uppercase">Month</label>
				<select
					className="text-black rounded-md px-2 py-1 w-full"
					value={month}
					onChange={({ target }) => setMonth(target.value)}
				>
					{months.map((month) => (
						<option key={month} value={month}>
							{month}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}

export default SelectDate;

const currentYear = new Date().getFullYear();
const years: number[] = [];
for (let i = 2023; i < currentYear + 2; i++) {
	years.push(i);
}
