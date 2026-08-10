import { Program } from "./Program";
import { LoggerFn, ProcessID, ProcessState, ProgramDiagnostic, ProgramID } from "./types";
type AnyProgram = Program<any, any>;
export declare class Process<S> {
    readonly id: ProcessID;
    readonly programID: ProgramID;
    private readonly proc;
    private readonly dispatchFn;
    private readonly logFn;
    private lifecycleState;
    private state;
    constructor(id: ProcessID, programID: ProgramID, proc: AnyProgram, dispatchFn: (event: any) => Promise<void>, logFn: LoggerFn);
    init(): Promise<ProgramDiagnostic>;
    stop(): Promise<ProgramDiagnostic>;
    getState(): ProcessState;
    dispatch(event: any): Promise<void>;
}
export {};
//# sourceMappingURL=Process.d.ts.map