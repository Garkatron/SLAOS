import { ChannelsMap } from "../glue/types";
export type WindowVisibility = "visible" | "hidden";
export type WindowInstanceId = number;
export type WindowSizeState = "maximized" | "minimized" | "custom";
export interface FrameParts {
    frame: HTMLElement;
    getContent: () => HTMLElement;
    ready: Promise<WindowControls>;
}
type WindowsEventBase = {
    type: WindowsEventKind;
};
type WindowsEventKind = "open" | "close" | "hide" | "show" | "resize" | "move";
export type WindowHandle = {
    id: number;
    render: <S>(state: S) => void;
    close: () => void;
    openWindow: () => void;
    isOpen: () => boolean;
    getTitle: () => string;
    setTitle: (title: string) => void;
    setSize: (w: number, h: number) => void;
    setPosition: (x: number, y: number) => void;
    setVisibility: (v: "visible" | "hidden") => void;
    toggleVisibility: () => void;
    setCallbacks: (c: WindowCallbacks) => void;
    getChannels: <C extends ChannelsMap>() => C;
};
export type WindowsEvent = (WindowsEventBase & {
    type: "open" | "close" | "hide" | "show";
    payload?: never;
}) | (WindowsEventBase & {
    type: "resize";
    payload: {
        width: number;
        height: number;
    };
}) | (WindowsEventBase & {
    type: "move";
    payload: {
        x: number;
        y: number;
    };
});
export interface WindowProps {
    type: string;
    title?: string;
    width: number;
    height: number;
    debug?: boolean;
    initialX?: number | "center" | "left" | "right";
    initialY?: number | "center" | "top" | "bottom";
    maxWidth?: number;
    maxHeight?: number;
    minWidth?: number;
    minHeight?: number;
    resizeable?: boolean;
    closeable?: boolean;
    minimizable?: boolean;
    scrollable?: boolean;
}
export type RenderCallback = (element: HTMLElement) => void;
export interface WindowCallbacks {
    onResize?: (width: number, height: number) => void;
    onClose?: () => void;
    onOpen?: () => void;
    onVisibilityChange?: (visible: WindowVisibility) => void;
    onMove?: (x: number, y: number) => void;
    onTitleChange?: (title: string) => void;
}
export interface WindowControls {
    close: HTMLElement;
    hidden: HTMLElement;
    maximize: HTMLElement;
}
export interface CanvasRenderer<T = unknown> {
    mount(parent: HTMLElement, view: T): void;
    unmount(parent: HTMLElement): void;
}
export {};
//# sourceMappingURL=types.d.ts.map