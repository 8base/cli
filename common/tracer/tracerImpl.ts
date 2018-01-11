interface ITraceOutput {
    print(data: string):any;
}

class ToConsole  implements ITraceOutput {
    print(data: string): any {
        console.log(data);
    }
}

export enum TraceLevel {
    Trace, Debug
}

export class Tracer {
    constructor() {
        this.output = new ToConsole();
    }

    trace(level: TraceLevel, data: string) {
        // todo check level
        this.output.print(data);
    }

    private output: ITraceOutput;
}

