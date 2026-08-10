export type ProgramID = `${string}-${string}`;
export type ProcessID = number;
export type Task<E> = Promise<E | null>;
export type UpdateResult<E, S> = {
    state: S;
    task?: Task<E>;
};
export type ProgramDiagnostic = {
    type: "success" | "failure";
    message: string;
};
export declare enum ProcessState {
    Created = "created",
    Running = "running",
    Paused = "paused",
    Stopped = "stopped",
    Failed = "failed",
    Terminated = "terminated"
}
export interface ProgramMeta {
    name: string;
    version: string;
    description?: string;
    lastUpdate?: Date;
}
export interface ProcessApi {
    log: LoggerFn;
    spawn(processId: ProgramID): Promise<ProcessID>;
    stop(processId: ProcessID): Promise<void>;
    getProgramsMeta(): Map<ProgramID, ProgramMeta>;
    getProcessNumberWithState(state: ProcessState): string[];
}
export type LoggerLevels = "debug" | "info" | "error" | "warning";
export type LoggerFn = (level: LoggerLevels, message: string | any) => void;
//# sourceMappingURL=types.d.ts.map