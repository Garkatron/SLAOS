import { ChannelsMap } from "../glue/types";
import { WindowInstance } from "./Window";


export interface FrameParts {
    frame: HTMLElement;
    getContent: () => HTMLElement;
    ready: Promise<WindowControls>;
}


export type WindowVisibility = "visible" | "hidden";
export type WindowSizeState = "maximized" | "minimized" | "custom";
type WindowsEventBase = { type: WindowsEventKind };
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

export type WindowsEvent =
    | (WindowsEventBase & {
          type: "open" | "close" | "hide" | "show";
          payload?: never;
      })
    | (WindowsEventBase & {
          type: "resize";
          payload: { width: number; height: number };
      })
    | (WindowsEventBase & { type: "move"; payload: { x: number; y: number } });

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

export interface RendererAdapter<T> {
    mount(parent: HTMLElement, view: T): void;
    unmount(parent: HTMLElement): void;
}
