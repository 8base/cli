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
    private enableLevel: TraceLevel;

    constructor() {
        this.enableLevel = TraceLevel.Trace;
        this.output = new ToConsole();
    }

    set level(level: TraceLevel) {
        this.enableLevel = level;
    }

    trace(level: TraceLevel, data: string) {
        if (level <= this.enableLevel)
            this.output.print(data);
    }

    private output: ITraceOutput;
}

