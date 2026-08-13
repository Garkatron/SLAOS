
/*

1. Custom user fields
2. Easy to use



*/

/**
 * A promise factory.
 */
type Task<M> = () => Promise<M>;

const Task = {
    /**
     * Wraps an existent promise into another promise.
     */
    fromPromise: <M>(p: Promise<M>): Task<M> => () => p,
    /**
     * Takes a promise factory.
     */
    from: <M>(thunk: () => Promise<M>): Task<M> => thunk,
    /**
     * Wraps a constant value.
     * Useful for testing.
     */
    of: <M>(value: M): Task<M> => () => Promise.resolve(value),
};

type DispatchFn<M> = (m: M) => void;

interface Init {
    init(): Promise<Task<MyMessage> | undefined>;
}

interface Update<M> {
  update(message: M): Promise<Task<M> | undefined>;
}

interface View<M> {
    view(root: HTMLElement, dispatch: DispatchFn<M>): void;
}


abstract class App<M> implements Init, View<M>, Update < M > {

    abstract init(): Promise<Task<MyMessage> | undefined>;
    async stop(): Promise<Task<MyMessage> | undefined> { return; };
    async pause(): Promise<Task<MyMessage> | undefined> { return; };

    abstract update(message: M): Promise<Task<M> | undefined>;
    abstract view(root: HTMLElement, dispatch: DispatchFn<M>): void;

}

interface Decrement { kind: "decrement", value: number };
interface Increment { kind: "increment", value: number };
type MyMessage = Increment | Decrement;



class Program extends App<MyMessage>
{

    private value: number = 0;

    async update(message: MyMessage): Promise<Task<MyMessage> | undefined> {
        switch (message.kind) {
            case "increment": {
                this.value += message.value;
            }

            case "decrement": {
                this.value -= message.value;
                break;
            }
        }

        return;
    }

    async init(): Promise<Task<MyMessage> | undefined> {
        this.value = 0;
        return;
    }

    view(root: HTMLElement, dispatch: DispatchFn<MyMessage>): void {

    }




}

enum ProcessState {
  Uninitialized,
  Initializing,
  Running,
  Pausing,
  Paused,
  Stopping,
  Stopped,
  Failed,
}

type AnyApp = App<any>;

class Process<M> {
    private _state: ProcessState = ProcessState.Uninitialized;

    get state(): ProcessState {
        return this._state;
    }

    constructor(
        private root: HTMLElement,
        private app: AnyApp,
    ) { }

    private is(state: ProcessState): boolean {
        return this._state === state;
    }

    async start(): Promise<void> {
        if (this.is(ProcessState.Running) || this.is(ProcessState.Initializing)) return;
         if (this.is(ProcessState.Stopped)) return;
         if (this.is(ProcessState.Failed)) return;

        this._state = ProcessState.Initializing;

        try {
            const task = await this.app.init();
            this.app.view(this.root, this.dispatch);

            this._state = ProcessState.Running;

            if (task) {
                const next = await task();
                if (next && this._state === ProcessState.Running) {
                    await this.dispatch(next);
                }
            }
        } catch(error) {
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


     async dispatch(message: any): Promise<void>  {
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
}


class Runtime {
    makeProcess<M>(app: App<M>, root: HTMLElement): Process<M> {
        return new Process<M>(root, app);
    }

    async run<M>(process: Process<M>) {
      await process.start();
    }
}
