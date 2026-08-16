import Program from "../program/Program";

export enum ProcessState {
    Uninitialized,
    Initializing,
    Running,
    Pausing,
    Paused,
    Stopping,
    Stopped,
    Failed,
}

type AnyProgram = Program<any>;

export default class Process {
    private _state: ProcessState = ProcessState.Uninitialized;

    private childProcess: Process[] | undefined;

    get state(): ProcessState {
        return this._state;
    }

    constructor(
        private root: HTMLElement,
        private app: AnyProgram,
    ) {}

    // Arrow function so `this` is always the Process instance, even when
    // passed as a callback to view / init / event handlers.
    dispatch = async (message: any): Promise<void> => {
        if (this._state === ProcessState.Stopped) return;
        if (this._state !== ProcessState.Running) return;

        const task = await this.app.update(message);
        this.app.view(this.root, this.dispatch);

        if (!task) return;

        const nextEvent = await task();
        if (!nextEvent) return;

        if (this._state === ProcessState.Running) {
            await this.dispatch(nextEvent);
        }
    };

    private is(state: ProcessState): boolean {
        return this._state === state;
    }

    async start(): Promise<void> {
        if (this.is(ProcessState.Running) || this.is(ProcessState.Initializing))
            return;
        if (this.is(ProcessState.Stopped)) return;
        if (this.is(ProcessState.Failed)) return;

        this._state = ProcessState.Initializing;

        try {
            const task = await this.app.init(this.dispatch);
            this.app.view(this.root, this.dispatch);

            this._state = ProcessState.Running;

            if (task) {
                const next = await task();
                if (next && this._state === ProcessState.Running) {
                    await this.dispatch(next);
                }
            }
        } catch (error) {
            this._state = ProcessState.Failed;
            throw error;
        }
    }

    async pause(): Promise<void> {
        if (this._state !== ProcessState.Running) return;

        this._state = ProcessState.Pausing;

        try {
            const task = await (this.app as any).pause?.();

            if (task) {
                const next = await task();
                if (next && this._state === ProcessState.Pausing) {
                    await this.dispatch(next);
                }
            }
        } catch (error) {
            this._state = ProcessState.Failed;
            throw error;
        } finally {
            if (this._state === ProcessState.Pausing) {
                this._state = ProcessState.Paused;
            }
        }
    }

    resume(): void {
        if (this._state !== ProcessState.Paused) return;
        this._state = ProcessState.Running;
    }

    async stop(): Promise<void> {
        if (this._state === ProcessState.Stopped) return;
        if (this._state === ProcessState.Failed) return;

        this._state = ProcessState.Stopping;

        try {
            const task = await (this.app as any).stop?.();
            this.app.detachChannels();

            if (task) {
                const next = await task();

                void next;
            }
        } catch (error) {
            this._state = ProcessState.Failed;
            throw error;
        } finally {
            if (this._state === ProcessState.Stopping) {
                this._state = ProcessState.Stopped;
            }
        }
    }
}
