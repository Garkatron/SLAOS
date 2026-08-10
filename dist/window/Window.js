export const WINDOW_DEFAULT_PROPS = {
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
export class WindowInstance {
    instanceId;
    frame;
    content;
    windowProps;
    canvas;
    visibility = "visible";
    sizeState = "custom";
    open = true;
    callbacks = {};
    unsub;
    controls;
    onCloseClick = () => this.close();
    onHidden = () => this.setVisibility("hidden");
    onMaximizeClick = () => this.toggleMaxMinSize();
    restoreState = null;
    id() {
        return this.instanceId;
    }
    constructor(instanceId, frame, content, windowProps, canvas) {
        this.instanceId = instanceId;
        this.frame = frame;
        this.content = content;
        this.windowProps = windowProps;
        this.canvas = canvas;
    }
    api() {
        return {
            id: this.instanceId,
            render: (s) => this.render(this.content, s),
            close: () => this.close(),
            openWindow: () => this.openWindow(),
            getTitle: () => this.windowProps.title ?? "",
            setTitle: (t) => this.setTitle(t),
            setSize: (w, h) => this.setSize(w, h),
            setPosition: (x, y) => this.setPosition(x, y),
            setVisibility: (v) => this.setVisibility(v),
            toggleVisibility: () => this.toggleVisibility(),
            isOpen: () => this.isOpen(),
            setCallbacks: (c) => this.setCallbacks(c),
            getChannels: () => this.getChannels(),
        };
    }
    getChannels() {
        return this.canvas.channels;
    }
    setCallbacks(callbacks) {
        this.callbacks = callbacks;
    }
    toggleMaxMinSize() {
        if (this.sizeState === "maximized") {
            this.restore();
        }
        else {
            this.maximize();
        }
    }
    maximize() {
        this.restoreState = {
            width: this.frame.offsetWidth,
            height: this.frame.offsetHeight,
            left: this.frame.style.left,
            top: this.frame.style.top,
        };
        this.setSize(this.windowProps.maxWidth, this.windowProps.maxHeight);
        this.sizeState = "maximized";
    }
    minimize() {
        this.restoreState = {
            width: this.frame.offsetWidth,
            height: this.frame.offsetHeight,
            left: this.frame.style.left,
            top: this.frame.style.top,
        };
        this.setSize(this.windowProps.minWidth, this.windowProps.minHeight);
        this.sizeState = "maximized";
    }
    restore() {
        if (this.restoreState) {
            this.setSize(this.restoreState.width, this.restoreState.height);
            this.frame.style.left = this.restoreState.left;
            this.frame.style.top = this.restoreState.top;
        }
        this.restoreState = null;
        this.sizeState = "custom";
    }
    close() {
        if (!this.open)
            return;
        this.open = false;
        this.detachSignal();
        this.detachControls();
        this.callbacks.onClose?.();
        this.frame.remove();
    }
    openWindow() {
        if (this.open)
            return;
        this.open = true;
        this.visibility = "visible";
        this.callbacks.onOpen?.();
    }
    setSize(width, height) {
        this.frame.style.width = `${width}px`;
        this.frame.style.height = `${height}px`;
        this.callbacks.onResize?.(width, height);
        if (this.sizeState !== "maximized")
            this.sizeState = "custom";
    }
    setPosition(x, y) {
        this.frame.style.left = `${x}px`;
        this.frame.style.top = `${y}px`;
        this.callbacks.onMove?.(x, y);
    }
    toggleVisibility() {
        this.setVisibility(this.visibility === "visible" ? "hidden" : "visible");
    }
    setVisibility(visibility) {
        this.visibility = visibility;
        this.callbacks.onVisibilityChange?.(visibility);
        this.frame.style.visibility = visibility;
    }
    setTitle(title) {
        this.windowProps.title = title;
        this.callbacks.onTitleChange?.(title);
    }
    setContent(content) {
        this.content = content;
    }
    setControls(controls) {
        this.controls = controls;
        this.controls.close?.addEventListener("click", this.onCloseClick);
        this.controls.hidden?.addEventListener("click", this.onHidden);
        this.controls.maximize?.addEventListener("click", this.onMaximizeClick);
    }
    detachControls() {
        this.controls?.close?.removeEventListener("click", this.onCloseClick);
        this.controls?.hidden?.removeEventListener("click", this.onHidden);
        this.controls?.maximize?.removeEventListener("click", this.onMaximizeClick);
        this.controls = undefined;
    }
    detachSignal() {
        this.unsub?.();
        this.unsub = undefined;
    }
    render(parent = this.content, state) {
        this.canvas.renderer?.mount(parent, this.canvas.view(state));
    }
    isOpen() {
        return this.open;
    }
    isVisible() {
        return this.visibility === "visible";
    }
}
//# sourceMappingURL=Window.js.map