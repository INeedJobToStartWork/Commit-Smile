import chalk from "chalk";

export default class logging {
	static log(...data: unknown[]): void {
		console.log(...data);
	}
	static error(...data: unknown[]): void {
		console.error(chalk.bgRed(" ERROR "), ...data);
	}
	static debug(...data: unknown[]): void {
		if (process.env.DEBUG === "TRUE") console.debug(chalk.bgGray(" DEBUG "), ...data);
	}
	static success(...data: unknown[]): void {
		console.log(chalk.bgGreen(" SUCCESS "), ...data);
	}
	static info(...data: unknown[]): void {
		console.info(chalk.bgBlue(" INFO "), ...data);
	}
	static warn(...data: unknown[]): void {
		console.warn(chalk.bgYellow(" WARN "), ...data);
	}
}
