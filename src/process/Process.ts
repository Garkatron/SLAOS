import { Program } from "./Program";
import {
    LoggerFn,
    LoggerLevels,
    ProcessID,
    ProcessState,
    ProgramDiagnostic,
    ProgramID,
} from "./types";
import { fail, success } from "./utils";

type AnyProgram = Program<any, any>;


export class Process<S> {
    private lifecycleState: ProcessState = ProcessState.Created;
    private state!: S;
    private program!: AnyProgram;

    constructor(
        readonly id: ProcessID,
        readonly programID: ProgramID,
    ) {}

    setProgram(program: AnyProgram) {
        this.program = program;
    }


    async init(): Promise<ProgramDiagnostic> {
        if (this.lifecycleState === ProcessState.Running)
            return success("Already running");
        this.lifecycleState = ProcessState.Running;

        const r = await this.program.onInit((state) => {
            this.state = state;
            this.program.render(this.state);
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

        const r = await this.program.onStop();
        if (r.message === "failure") this.lifecycleState = ProcessState.Failed;

        return r;
    }

    getState(): ProcessState {
        return this.lifecycleState;
    }

    async dispatch(event: any): Promise<void> {
        if (this.lifecycleState !== ProcessState.Running) return;
        try {
            const updateResult = await this.program.update(event, this.state);
            this.state = updateResult.state;
            this.program.render(this.state);
            const task = updateResult?.task;
            if (!task) return;
            const nextEvent = await task;
            if (nextEvent == null) return;
            await this.dispatch(nextEvent);
        } catch (error) {
            this.lifecycleState = ProcessState.Failed;
            throw error;
        }
    }
}
