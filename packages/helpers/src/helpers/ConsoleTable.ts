const colors = require('colors');
import Table from "cli-table3";

export class ConsoleTable {
	static async print(head: string[], rows: any) {
		const chars = {
			'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
			, 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
			, 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
			, 'right': '║', 'right-mid': '╢', 'middle': '│'
		}

		let table: any = new Table({
			head: head.map(value => colors.green(value)),
			chars
		});

		table.push(...rows);

		console.log(table.toString());
	}
}

export default ConsoleTable;
