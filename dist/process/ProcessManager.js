import { Process } from "./Process";
export class ProcessManager {
    windowManager;
    registry = new Map();
    meta = new Map();
    processes = [];
    nextId = 0;
    log = this.processLogger;
    processLogger(level) {
        switch (level) {
            case "info": console.info(level);
            case "debug": console.debug(level);
            case "warning": console.warn(level);
            case "error": console.error(level);
            default: console.log(level);
        }
    }
    constructor(windowManager) {
        this.windowManager = windowManager;
    }
    generateId() {
        return `${crypto.randomUUID().replace(/-/g, '').slice(0, 4)}-${crypto.randomUUID().replace(/-/g, '').slice(0, 4)}`;
    }
    getProcessNumberWithState(state) {
        return this.processes
            .filter((p) => p.getState() === state)
            .map((v) => v.processID);
    }
    getProgramsMeta() {
        return new Map(this.meta);
    }
    registerProgram(meta, factory) {
        const id = this.generateId();
        this.meta.set(id, meta);
        this.registry.set(id, factory);
        return id;
    }
    async spawn(programId) {
        const processId = this.nextId++;
        const processFactory = this.registry.get(programId);
        console.info("AAAAAAAAAAA: ,", processFactory, this.registry);
        if (!processFactory)
            throw new Error(`Process not found: ${programId}`);
        const processInstance = new Process(processId, programId, null, async (_event) => { }, this.log);
        const dispatchToRuntime = async (event) => {
            await processInstance.dispatch(event);
        };
        const process = processFactory({
            window: this.windowManager,
            process: {
                getProcessNumberWithState: (state) => this.getProcessNumberWithState(state),
                getProgramsMeta: () => this.getProgramsMeta(),
                spawn: (programId) => this.spawn(programId),
                stop: (processId) => this.stop(processId),
                log: (level, message) => this.log(level, message),
            },
        });
        process.__bindDispatch(dispatchToRuntime);
        processInstance.proc = process;
        processInstance.dispatchFn = dispatchToRuntime;
        this.processes.push(processInstance);
        const startResult = await processInstance.init();
        if (startResult.message === "failure")
            throw new Error(startResult.message);
        return processId;
    }
    async stop(processId) {
        const process = this.processes.find((p) => p.id === processId);
        if (!process)
            throw new Error(`Process not found: ${processId}`);
        await process.stop();
        this.processes = this.processes.filter((p) => p.id !== processId);
    }
}
//# sourceMappingURL=ProcessManager.js.map