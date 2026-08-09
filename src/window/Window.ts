import { ChannelsMap } from "../glue/types";
import Canvas from "./Canvas";
import {
    WindowHandle,
    WindowCallbacks,
    WindowControls,
    WindowInstanceId,
    WindowProps,
    WindowSizeState,
    WindowVisibility,
} from "./types";

export const WINDOW_DEFAULT_PROPS: WindowProps = {
    type: "default",
    title: "ExampleWindow",
    minHeight: 500,
    height: 720,
    maxHeight: 720,
    minWidth: 500,
    width: 1080,
    maxWidth: 1080,
    minimizable: true,
    resizeable: true,
    initialX: 0,
    initialY: 0,
    closeable: true,
    debug: false,
    scrollable: true,
};

export class WindowInstance<P extends WindowProps> {
    private visibility: WindowVisibility = "visible";
    private sizeState: WindowSizeState = "custom";
    private open = true;
    private callbacks: WindowCallbacks = {};
    private unsub?: () => void;
    private controls: WindowControls | undefined;
    private onCloseClick = () => this.close();
    private onHidden = () => this.setVisibility("hidden");
    private onMaximizeClick = () => this.toggleMaxMinSize();

    private restoreState: {
        width: number;
        height: number;
        left: string;
        top: string;
    } | null = null;

    id(): WindowInstanceId {
        return this.instanceId;
    }

    constructor(
        private instanceId: WindowInstanceId,
        private frame: HTMLElement,
        private content: HTMLElement,
        public windowProps: P,
        private canvas: Canvas<any, any, any>,
    ) {}

    api(): WindowHandle {
        return {
            id: this.instanceId,
            render: (s) => this.render(this.content, s),
            close: () => this.close(),
            openWindow: () => this.openWindow(),
            getTitle: () => this.windowProps.title ?? "",
            setTitle: (t) => this.setTitle(t),
            setSize: (w, h) => this.setSize(w, h),
            setPosition: (x, y) => this.setPosition(x, y),
            setVisibility: (v) => this.setVisibility(v as any),
            toggleVisibility: () => this.toggleVisibility(),
            isOpen: () => this.isOpen(),
            setCallbacks: (c) => this.setCallbacks(c),
            getChannels: <C extends ChannelsMap>() => this.getChannels(),
        };
    }

    getChannels<C extends ChannelsMap>(): C {
        return this.canvas.channels;
    }



    setCallbacks(callbacks: WindowCallbacks) {
        this.callbacks = callbacks;
    }

    toggleMaxMinSize() {
        if (this.sizeState === "maximized") {
            this.restore();
        } else {
            this.maximize();
        }
    }

    private maximize() {
        this.restoreState = {
            width: this.frame.offsetWidth,
            height: this.frame.offsetHeight,
            left: this.frame.style.left,
            top: this.frame.style.top,
        };
        this.setSize(this.windowProps.maxWidth!, this.windowProps.maxHeight!);

        this.sizeState = "maximized";
    }

    private minimize() {
        this.restoreState = {
            width: this.frame.offsetWidth,
            height: this.frame.offsetHeight,
            left: this.frame.style.left,
            top: this.frame.style.top,
        };
        this.setSize(this.windowProps.minWidth!, this.windowProps.minHeight!);
        this.sizeState = "maximized";
    }

    private restore() {
        if (this.restoreState) {
            this.setSize(this.restoreState.width, this.restoreState.height);
            this.frame.style.left = this.restoreState.left;
            this.frame.style.top = this.restoreState.top;
        }
        this.restoreState = null;
        this.sizeState = "custom";
    }

    close() {
        if (!this.open) return;
        this.open = false;
        this.detachSignal();
        this.detachControls();
        this.callbacks.onClose?.();
        this.frame.remove();
    }

    openWindow() {
        if (this.open) return;
        this.open = true;
        this.visibility = "visible";
        this.callbacks.onOpen?.();
    }

    setSize(width: number, height: number) {
        this.frame.style.width = `${width}px`;
        this.frame.style.height = `${height}px`;
        this.callbacks.onResize?.(width, height);
        if (this.sizeState !== "maximized") this.sizeState = "custom";
    }

    setPosition(x: number, y: number) {
        this.frame.style.left = `${x}px`;
        this.frame.style.top = `${y}px`;
        this.callbacks.onMove?.(x, y);
    }

    toggleVisibility() {
        this.setVisibility(
            this.visibility === "visible" ? "hidden" : "visible",
        );
    }

    setVisibility(visibility: WindowVisibility) {
        this.visibility = visibility;
        this.callbacks.onVisibilityChange?.(visibility);
        this.frame.style.visibility = visibility;
    }

    setTitle(title: string) {
        this.windowProps.title = title;
        this.callbacks.onTitleChange?.(title);
    }


    setContent(content: HTMLElement) {
        this.content = content;
    }

    setControls(controls: WindowControls) {
        this.controls = controls;
        this.controls.close?.addEventListener("click", this.onCloseClick);
        this.controls.hidden?.addEventListener("click", this.onHidden);
        this.controls.maximize?.addEventListener("click", this.onMaximizeClick);
    }

    detachControls() {
        this.controls?.close?.removeEventListener("click", this.onCloseClick);
        this.controls?.hidden?.removeEventListener("click", this.onHidden);
        this.controls?.maximize?.removeEventListener(
            "click",
            this.onMaximizeClick,
        );
        this.controls = undefined;
    }

    detachSignal() {
        this.unsub?.();
        this.unsub = undefined;
    }



    render(parent: HTMLElement = this.content, state: any) {
        this.canvas.renderer?.mount(parent, this.canvas.view(state));
    }

    isOpen(): boolean {
        return this.open;
    }

    isVisible(): boolean {
        return this.visibility === "visible";
    }
}
