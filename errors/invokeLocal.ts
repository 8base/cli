import chalk from "chalk";
import { Colors } from "../consts/Colors";

export class InvokeLocalError extends Error {

    constructor(message: string, functionName: string, functionPath: string) {
        super();
        this.message = `Function ${chalk.hex(Colors.yellow)(functionName)}:${chalk.hex(Colors.yellow)(functionPath)}\n thrown error ${message}`;
    }
}