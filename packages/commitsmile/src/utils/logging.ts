import chalk from "chalk";

//----------------------
// Classes
//----------------------

/**
 * Our Logging class
 *
 * @description Provides formatted console logging with different severity levels and colored prefixes.
 *
 * @internal
 * @dontexport
 * */
export const logging = {
	log(...data: unknown[]): void {
		console.log(...data);
	},
	error(...data: unknown[]): void {
		console.error(chalk.bgRed(" ERROR "), ...data);
	},
	debug(...data: unknown[]): void {
		if (process.env.DEBUG === "TRUE") console.debug(chalk.bgGray(" DEBUG "), ...data);
	},
	success(...data: unknown[]): void {
		console.log(chalk.bgGreen(" SUCCESS "), ...data);
	},
	info(...data: unknown[]): void {
		console.info(chalk.bgBlue(" INFO "), ...data);
	},
	warn(...data: unknown[]): void {
		console.warn(chalk.bgYellow(" WARN "), ...data);
	}
};
export default logging;
