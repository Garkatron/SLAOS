import { slaOSApi } from "../slaOS";
import { WindowManager } from "../window/WindowManager";
import { Program } from "./Program";
import { ProgramID, ProcessID, ProcessState, ProgramMeta, LoggerFn } from "./types";
type RuntimeProgram = Program<any, any>;
export declare class ProcessManager {
    private readonly windowManager;
    private readonly registry;
    private readonly meta;
    private processes;
    private nextId;
    log: LoggerFn;
    private processLogger;
    constructor(windowManager: WindowManager);
    private generateId;
    getProcessNumberWithState(state: ProcessState): string[];
    getProgramsMeta(): Map<ProgramID, ProgramMeta>;
    registerProgram(meta: ProgramMeta, factory: (api: slaOSApi) => RuntimeProgram): ProgramID;
    spawn(programId: ProgramID): Promise<ProcessID>;
    stop(processId: ProcessID): Promise<void>;
}
export {};
//# sourceMappingURL=ProcessManager.d.ts.map