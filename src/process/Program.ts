import { WindowProps } from "../window/types";
import { ChannelsMap, UnsubscribeFn } from "../glue/types";
import Canvas from "../window/Canvas";
import { WindowHandle } from "../window/types";
import { WINDOW_DEFAULT_PROPS } from "../window/Window";
import { LoggerFn, LoggerLevels, ProgramDiagnostic, UpdateResult } from "./types";
import { slaOSApi } from "../slaOS";

// Takes messages and mutates state;
// E = Event
// S = State
export abstract class Program<E, S> {
    private _dispatch!: (event: E) => Promise<void>;
    private windowUnsubs = new Map<WindowHandle, UnsubscribeFn[]>();
    private windows: WindowHandle[] = [];

    log!: LoggerFn;

    constructor(
        protected os: slaOSApi
    ){}

    __bindDispatch(dispatch: (event: E) => Promise<void>) {
        this._dispatch = dispatch;
    }


    render(state: S): void {
        for (const handle of this.windows) {
            handle.render(state);
        }
    }
    protected dispatch(event: E): Promise<void> {
        return this._dispatch(event);
    }

    protected async spawnWindow<C extends ChannelsMap, V, P extends WindowProps>(
        canvas: Canvas<C, S, V>,
        windowProps: P
    ): Promise<WindowHandle> {
        const handle = await this.os.window.spawn(canvas, windowProps);
        this.windows.push(handle);
        const unsubs: UnsubscribeFn[] = [];
        for (const [key, channel] of Object.entries(canvas.channels)) {
            unsubs.push(
                channel.subscribe((event: any) =>
                    this.dispatch({ channel: key, ...event } as E),
                ),
            );
        }
        this.windowUnsubs.set(handle, unsubs);

        return handle;
    }

    protected closeWindow(handle: WindowHandle): void {
        this.windowUnsubs.get(handle)?.forEach((u) => u());
        this.windowUnsubs.delete(handle);
        handle.close();
    }

    abstract onInit(initState: (state: S) => void): Promise<ProgramDiagnostic>;
    abstract onStop(): Promise<ProgramDiagnostic>;
    abstract update(event: E, state: S): Promise<UpdateResult<E, S>>;
}
/*
export abstract class Program {

    windowManager?: WindowManager;

    abstract onStart(): ProcessResult;
    abstract onStop(): ProcessResult;
    abstract onPause(): ProcessResult;
    abstract onResume(): ProcessResult;
    abstract onWork(work: DispatchedWork): ProcessResult;
}
*/
