import { WindowManager } from "../window/WindowManager";
import { Process } from "./Process";
import { ProgramManager } from "./ProgramManager";
import { ProgramID, ProcessID } from "./types";

export class ProcessManager {
    private readonly processes: Map<ProcessID, Process<any>> = new Map();
    private nextId: ProcessID = 0;

    constructor(
        private readonly programManager: ProgramManager,
        private readonly windowManager: WindowManager,
    ) {}

    async spawn(programId: ProgramID): Promise<ProcessID> {
        const program = this.programManager.getProgramById(programId);
        if (!program) throw new Error(`Program not found: ${programId}`);
        const programFactory = program.factory;
        if (!programFactory) throw new Error(`Program has no factory: ${programId}`);

        const processId = this.nextId++;
        const processInstance = new Process(processId, programId);

        const programInstance = programFactory({
            window: this.windowManager,
            process: {
                spawn: (programId: ProgramID) => this.spawn(programId),
                stop: (processId: ProcessID) => this.stop(processId),
            },
        });

        processInstance.setProgram(programInstance);
        programInstance.setDispatch((event) => processInstance.dispatch(event));

        try {
            const startResult = await processInstance.init();
            if (startResult.message === "failure") {
                throw new Error(`Process init failed: ${programId}`);
            }
        } catch (error) {
            throw error;
        }

        this.processes.set(processId, processInstance);
        return processId;
    }

    async dispatch(processId: ProcessID, event: any): Promise<void> {
        const process = this.processes.get(processId);
        if (!process) throw new Error(`Process not found: ${processId}`);
        await process.dispatch(event);
    }

    async stop(processId: ProcessID): Promise<void> {
        const process = this.processes.get(processId);
        if (!process) throw new Error(`Process not found: ${processId}`);
        try {
            const stopResult = await process.stop();
            if (stopResult.message === "failure") {
                throw new Error(`Process stop failed: ${processId}`);
            }
        } finally {
            this.processes.delete(processId);
        }
    }
}
