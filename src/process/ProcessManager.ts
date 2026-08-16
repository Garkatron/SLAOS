import Process from "./Process";
import ProgramManager from "../program/ProgramManager";
import { ProcessHandle, ProcessID, ProgramID } from "../types";

class ProcessManager {
    private processes: Map<ProcessID, Process> = new Map();
    private nextId: ProcessID = 0;

    constructor(private readonly programManager: ProgramManager) {}

    async spawn(programId: ProgramID, root: HTMLElement): Promise<ProcessHandle> {
        const def = this.programManager.getProgramById(programId);
        if (!def) throw new Error(`Program not found: ${programId}`);

        const app = def.factory();
        const process = new Process(root, app);
        const id = this.nextId++;

        this.processes.set(id, process);

        return {
            start: () => process.start(),
            stop: () => process.stop(),
            pause: () => process.pause(),
            resume: async () => process.resume(),
        };
    }

    getProcess(id: ProcessID): Process | undefined {
        return this.processes.get(id);
    }
} 

export default ProcessManager;