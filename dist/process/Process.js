import { ProcessState } from "./types";
import { success } from "./utils";
export class Process {
    id;
    programID;
    proc;
    dispatchFn;
    logFn;
    lifecycleState = ProcessState.Created;
    state;
    constructor(id, programID, proc, dispatchFn, logFn) {
        this.id = id;
        this.programID = programID;
        this.proc = proc;
        this.dispatchFn = dispatchFn;
        this.logFn = logFn;
    }
    async init() {
        if (this.lifecycleState === ProcessState.Running)
            return success("Already running");
        this.lifecycleState = ProcessState.Running;
        this.proc.log = (level, message) => {
            this.logFn(level, `[${this.id}] -> ${message}`);
        };
        const r = await this.proc.onInit((state) => {
            this.state = state;
            this.proc.render(this.state);
        });
        if (r.message === "failure")
            this.lifecycleState = ProcessState.Failed;
        return r;
    }
    async stop() {
        if (this.lifecycleState === ProcessState.Created ||
            this.lifecycleState === ProcessState.Stopped) {
            return success("Already stopped");
        }
        this.lifecycleState = ProcessState.Stopped;
        const r = await this.proc.onStop();
        if (r.message === "failure")
            this.lifecycleState = ProcessState.Failed;
        return r;
    }
    getState() {
        return this.lifecycleState;
    }
    async dispatch(event) {
        if (this.lifecycleState !== ProcessState.Running)
            return;
        const updateResult = await this.proc.update(event, this.state);
        this.state = updateResult.state;
        this.proc.render(this.state);
        const task = updateResult?.task;
        if (!task)
            return;
        const nextEvent = await task;
        if (nextEvent == null)
            return;
        await this.dispatchFn(nextEvent);
    }
}
//# sourceMappingURL=Process.js.map