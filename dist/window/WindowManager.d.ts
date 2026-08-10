import Canvas from "./Canvas";
import { FrameParts, WindowHandle, WindowProps, WindowInstanceId } from "./types";
import { WindowInstance } from "./Window";
export declare class WindowManager {
    private windowsContainer;
    private windowFrameFactory;
    instances: WindowInstance<any>[];
    nextId: WindowInstanceId;
    constructor(windowsContainer: HTMLElement, windowFrameFactory: <P extends WindowProps>(props: P) => FrameParts);
    spawn<P extends WindowProps>(window: Canvas<any, any, any>, windowProps: P): Promise<WindowHandle>;
    getWindow(id: WindowInstanceId): WindowHandle | undefined;
    getWindows(): WindowHandle[];
    kill(instance: WindowInstance<any>): void;
}
//# sourceMappingURL=WindowManager.d.ts.map