import { Tracer, TraceLevel } from "./tracerImpl";

export { TraceLevel } from "./tracerImpl";

let tr = new Tracer();

export function trace(data: any) {
    tr.trace(TraceLevel.Trace, data);
}

export function debug(data: string) {
    tr.trace(TraceLevel.Debug, "debug: " + data);
}

export function setTraceLevel(level: TraceLevel) {
    tr.level = level;
}