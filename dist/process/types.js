export var ProcessState;
(function (ProcessState) {
    ProcessState["Created"] = "created";
    ProcessState["Running"] = "running";
    ProcessState["Paused"] = "paused";
    ProcessState["Stopped"] = "stopped";
    ProcessState["Failed"] = "failed";
    ProcessState["Terminated"] = "terminated";
})(ProcessState || (ProcessState = {}));
// export type ProcessResult = Promise<ProcessInfo<void>> | ProcessInfo<void>;
/* export interface ProcessInfo<T> {
    result: "failure" | "success";
    message: string;
    data?: T;
};

export type DispatchedWork = unknown;
*/
//# sourceMappingURL=types.js.map