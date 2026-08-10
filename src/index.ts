export { slaOS } from "./slaOS";
export type { slaOSApi } from "./slaOS";

export { ProcessManager } from "./process/ProcessManager";
export { Process } from "./process/Process";
export { Program } from "./process/Program";
export type {
    ProgramID,
    ProcessID,
    UpdateResult,
    ProgramDiagnostic,
    ProcessState,
    ProgramMeta,
    ProcessApi,
    LoggerLevels,
    LoggerFn,
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
    CanvasRenderer,
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
