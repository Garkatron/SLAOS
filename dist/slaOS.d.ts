import { ProcessManager } from "./process/ProcessManager";
import { ProcessApi } from "./process/types";
import { WindowManager } from "./window/WindowManager";
export interface slaOSApi {
    window: WindowManager;
    process: ProcessApi;
}
export declare class slaOS {
    readonly windowManager: WindowManager;
    readonly processManager?: ProcessManager | undefined;
    constructor(windowManager: WindowManager, processManager?: ProcessManager | undefined);
}
//# sourceMappingURL=slaOS.d.ts.map