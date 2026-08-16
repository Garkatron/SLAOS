import ProcessManager from "./process/ProcessManager";
import ProgramManager from "./program/ProgramManager";
import { WindowManager } from "./window/WindowManager";

export default class SlaOS {

    constructor(
        public window: WindowManager,
        public program: ProgramManager,
        public process?: ProcessManager,
    ) {
        this.process = new ProcessManager(this.program);
    }
}
