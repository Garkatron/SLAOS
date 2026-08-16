import { Task } from "./program/Task";
import type Program from "./program/Program";

export type ProcessID = number;
export type ProgramID = `${string}-${string}`;

export interface ProgramDefinition {
    name: string;
    version: string;
    description?: string;
    lastUpdate?: Date;
    factory: () => Program<any>;
}

export type DispatchFn<M> = (m: M) => void;

export interface Init<M> {
    init(dispatch: DispatchFn<M>): Promise<Task<M> | undefined>;
}

export interface Update<M> {
    update(message: M): Promise<Task<M> | undefined>;
}

export interface View<M> {
    view(root: HTMLElement, dispatch: DispatchFn<M>): void;
}

export interface ProcessHandle {
    start(): Promise<void>;
    stop(): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
}