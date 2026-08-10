import { slaOSApi } from "../slaOS";
import { WindowManager } from "../window/WindowManager";
import { Process } from "./Process";
import { Program } from "./Program";
import { ProgramID, ProcessID, ProcessState, ProgramMeta, LoggerFn, LoggerLevels } from "./types";

type RuntimeProgram = Program<any, any>;

export class ProcessManager {

    private readonly registry: Map<ProgramID, (likeOsApi: slaOSApi) => RuntimeProgram> = new Map();
    private readonly meta: Map<ProgramID, ProgramMeta> = new Map();

    private processes: Process<any>[] = [];
    private nextId: ProcessID = 0;

    log: LoggerFn = this.processLogger;

    private processLogger(level: LoggerLevels): void {
        switch (level) {
            case "info": console.info(level);
            case "debug": console.debug(level);
            case "warning": console.warn(level);
            case "error": console.error(level);
            default: console.log(level);
        }
    }


    constructor(private readonly windowManager: WindowManager) { }


    private generateId(): ProgramID {
      return `${crypto.randomUUID().replace(/-/g, '').slice(0, 4)}-${crypto.randomUUID().replace(/-/g, '').slice(0, 4)}`;
    }


    getProcessNumberWithState(state: ProcessState): string[] {
        return this.processes
            .filter((p) => p.getState() === state)
            .map((v) => (v as any).processID);
    }

    getProgramsMeta(): Map<ProgramID, ProgramMeta> {
        return new Map(this.meta);
    }

    registerProgram(
        meta: ProgramMeta,
        factory: (api: slaOSApi) => RuntimeProgram,
    ): ProgramID {
        const id = this.generateId();
        this.meta.set(id, meta);
        this.registry.set(id, factory);
        return id;
    }



    async spawn(programId: ProgramID): Promise<ProcessID> {
        const processId = this.nextId++;

        const processFactory = this.registry.get(programId);
        console.info("AAAAAAAAAAA: ,", processFactory, this.registry);
        if (!processFactory) throw new Error(`Process not found: ${programId}`);

        const processInstance = new Process(
            processId,
            programId,
            null as any,
            async (_event: any) => { },
            this.log,
        );

        const dispatchToRuntime = async (event: any) => {
            await processInstance.dispatch(event);
        };

        const process = processFactory({
            window: this.windowManager,
            process: {
                getProcessNumberWithState: (state: ProcessState) => this.getProcessNumberWithState(state),
                getProgramsMeta: () => this.getProgramsMeta(),
                spawn: (programId: ProgramID) => this.spawn(programId),
                stop: (processId: ProcessID) => this.stop(processId),
                log: (level: LoggerLevels, message: string | any) => this.log(level, message),
            },
        });

        (process as any).__bindDispatch(dispatchToRuntime);

        (processInstance as any).proc = process;
        (processInstance as any).dispatchFn = dispatchToRuntime;

        this.processes.push(processInstance);

        const startResult = await processInstance.init();
        if (startResult.message === "failure")
            throw new Error(startResult.message);

        return processId;
    }

    async stop(processId: ProcessID): Promise<void> {
        const process = this.processes.find((p) => (p as any).id === processId);
        if (!process) throw new Error(`Process not found: ${processId}`);

        await process.stop();
        this.processes = this.processes.filter(
            (p) => (p as any).id !== processId,
        );
    }
}
