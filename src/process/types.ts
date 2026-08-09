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

export enum ProcessState {
    Created = "created",
    Running = "running",
    Paused = "paused",
    Stopped = "stopped",
    Failed = "failed",
    Terminated = "terminated",
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
    getProcessNumberWithState(state: ProcessState): string[]
}

export type LoggerLevels = "debug" | "info" | "error" | "warning";
export type LoggerFn = (level: LoggerLevels, message: string | any) => void;

// export type ProcessResult = Promise<ProcessInfo<void>> | ProcessInfo<void>;
/* export interface ProcessInfo<T> {
    result: "failure" | "success";
    message: string;
    data?: T;
};

export type DispatchedWork = unknown;
*/
