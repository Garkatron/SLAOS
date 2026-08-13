export { slaOS } from "./slaOS";
export type { slaOSApi } from "./slaOS";

export { default as ProcessManager } from "./process/ProcessManager";
export { default as ProgramManager } from "./process/ProgramManager";
export { Process } from "./process/Process";
export { Program } from "./process/Program";
export type {
    ProgramID,
    ProcessID,
    UpdateResult,
    ProgramDiagnostic,
    ProcessState,
    ProgramDefinition,
    ProcessApi,
    LoggerLevels,
    LoggerFn,
    Task,
} from "./process/types";

export { WindowManager } from "./window/WindowManager";
export { WindowInstance, WINDOW_DEFAULT_PROPS } from "./window/Window";
export { default as Canvas } from "./window/Canvas";
export type {
    WindowVisibility,
    WindowInstanceId,
    WindowSizeState,
    FrameParts,
    WindowHandle,
    WindowProps,
    RenderCallback,
    WindowCallbacks,
    WindowControls,
    RendererAdapter,
} from "./window/types";

export { default as Channel } from "./glue/Channel";
export type {
    EventMap,
    UpdateFn,
    ChannelUpdateFn,
    UnsubscribeFn,
    EventMapFromUnion,
    ChannelsMap,
    EventsOf,
} from "./glue/types";

export type { Signal } from "./signal";
export { signal } from "./signal";
