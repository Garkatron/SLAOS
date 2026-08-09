import { Program } from "./Program";
import { LoggerFn, LoggerLevels, ProcessID, ProcessState, ProgramDiagnostic, ProgramID } from "./types";
import { fail, success } from "./utils";

type AnyProgram = Program<any, any>;

type Task<M> = Promise<M | null>;

export class Process<S> {
    private lifecycleState: ProcessState = ProcessState.Created;
    private state!: S;

    constructor(
        readonly id: ProcessID,
        readonly programID: ProgramID,
        private readonly proc: AnyProgram,
        private readonly dispatchFn: (event: any) => Promise<void>,
        private readonly logFn: LoggerFn,
    ) {}

    async init(): Promise<ProgramDiagnostic> {
        if (this.lifecycleState === ProcessState.Running)
            return success("Already running");
        this.lifecycleState = ProcessState.Running;

        this.proc.log = (level: LoggerLevels, message: string | any) => {
            this.logFn(level, `[${this.id}] -> ${message}`);
        }
        const r = await this.proc.onInit((state) => {
            this.state = state;
            this.proc.render(this.state);

        });
        if (r.message === "failure") this.lifecycleState = ProcessState.Failed;

        return r;
    }

    async stop(): Promise<ProgramDiagnostic> {
        if (
            this.lifecycleState === ProcessState.Created ||
            this.lifecycleState === ProcessState.Stopped
        ) {
            return success("Already stopped");
        }

        this.lifecycleState = ProcessState.Stopped;

        const r = await this.proc.onStop();
        if (r.message === "failure") this.lifecycleState = ProcessState.Failed;

        return r;
    }

    getState(): ProcessState {
        return this.lifecycleState;
    }

    async dispatch(event: any): Promise<void> {
        if (this.lifecycleState !== ProcessState.Running) return;


        const updateResult = await this.proc.update(event, this.state);

        this.state = updateResult.state;

        this.proc.render(this.state);

        const task: Task<any> | undefined = updateResult?.task;
        if (!task) return;

        const nextEvent = await task;
        if (nextEvent == null) return;

        await this.dispatchFn(nextEvent);
    }
}
