export type WindowID = number;
export type WindowVisibility = "visible" | "hidden";
export type WindowSizeState = "maximized" | "minimized" | "custom";

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

export interface FrameParts {
    frame: HTMLElement;
    getContent: () => HTMLElement;
    ready: Promise<WindowControls>;
}