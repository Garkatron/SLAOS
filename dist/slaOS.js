import { ProcessManager } from "./process/ProcessManager";
export class slaOS {
    windowManager;
    processManager;
    constructor(windowManager, processManager) {
        this.windowManager = windowManager;
        this.processManager = processManager;
        this.processManager = new ProcessManager(this.windowManager);
    }
}
//# sourceMappingURL=slaOS.js.map