import { slaOSApi } from "../slaOS";
import { Program } from "./Program";

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

export interface ProgramDefinition {
    name: string;
    version: string;
    description?: string;
    lastUpdate?: Date;
    factory: (api: slaOSApi) => Program<any, any>
}

export interface ProcessApi {
    spawn(processId: ProgramID): Promise<ProcessID>;
    stop(processId: ProcessID): Promise<void>;
}
