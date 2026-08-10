import { WindowProps } from "../window/types";
import { ChannelsMap } from "../glue/types";
import Canvas from "../window/Canvas";
import { WindowHandle } from "../window/types";
import { LoggerFn, ProgramDiagnostic, UpdateResult } from "./types";
import { slaOSApi } from "../slaOS";
export declare abstract class Program<E, S> {
    protected os: slaOSApi;
    private _dispatch;
    private windowUnsubs;
    private windows;
    log: LoggerFn;
    constructor(os: slaOSApi);
    __bindDispatch(dispatch: (event: E) => Promise<void>): void;
    render(state: S): void;
    protected dispatch(event: E): Promise<void>;
    protected spawnWindow<C extends ChannelsMap, V, P extends WindowProps>(canvas: Canvas<C, S, V>, windowProps: P): Promise<WindowHandle>;
    protected closeWindow(handle: WindowHandle): void;
    abstract onInit(initState: (state: S) => void): Promise<ProgramDiagnostic>;
    abstract onStop(): Promise<ProgramDiagnostic>;
    abstract update(event: E, state: S): Promise<UpdateResult<E, S>>;
}
//# sourceMappingURL=Program.d.ts.map