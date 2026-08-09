import { ProcessManager } from "./process/ProcessManager";
import { ProcessApi } from "./process/types";
import { WindowManager } from "./window/WindowManager";

// TODO: Make a customs restricted APIs.
export interface slaOSApi {
    window: WindowManager;
    process: ProcessApi;
}

export class slaOS {
    constructor(
        readonly windowManager: WindowManager,
        readonly processManager?: ProcessManager,
    ) {
        this.processManager = new ProcessManager(this.windowManager);
    }
}
