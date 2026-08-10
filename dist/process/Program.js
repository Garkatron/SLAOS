// Takes messages and mutates state;
// E = Event
// S = State
export class Program {
    os;
    _dispatch;
    windowUnsubs = new Map();
    windows = [];
    log;
    constructor(os) {
        this.os = os;
    }
    __bindDispatch(dispatch) {
        this._dispatch = dispatch;
    }
    render(state) {
        for (const handle of this.windows) {
            handle.render(state);
        }
    }
    dispatch(event) {
        return this._dispatch(event);
    }
    async spawnWindow(canvas, windowProps) {
        const handle = await this.os.window.spawn(canvas, windowProps);
        this.windows.push(handle);
        const unsubs = [];
        for (const [key, channel] of Object.entries(canvas.channels)) {
            unsubs.push(channel.subscribe((event) => this.dispatch({ channel: key, ...event })));
        }
        this.windowUnsubs.set(handle, unsubs);
        return handle;
    }
    closeWindow(handle) {
        this.windowUnsubs.get(handle)?.forEach((u) => u());
        this.windowUnsubs.delete(handle);
        handle.close();
    }
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
//# sourceMappingURL=Program.js.map