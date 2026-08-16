import SlaOS from "./slaOS";

export { Channel, ChannelsMap, EventsOf, UnsubscribeFn } from "./channel/Channel";
export { default as Process } from "./process/Process";
export { ProcessState } from "./process/Process";
export { default as Program } from "./program/Program";
export { default as ProgramManager } from "./program/ProgramManager";
export { default as ProcessManager } from "./process/ProcessManager";
export { Task } from "./program/Task";
export { Window } from "./window/Window";
export { WindowManager } from "./window/WindowManager";
export { default as SlaOS } from "./slaOS";
export type {
    WindowID,
    WindowProps,
    WindowCallbacks,
    WindowControls,
    WindowVisibility,
    WindowSizeState,
    FrameParts,
} from "./window/types";
export type {
    ProcessID,
    ProgramID,
    ProgramDefinition,
    ProcessHandle,
    DispatchFn,
    Init,
    Update,
    View,
} from "./types";
