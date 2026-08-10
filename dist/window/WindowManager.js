import { WindowInstance } from "./Window";
export class WindowManager {
    windowsContainer;
    windowFrameFactory;
    instances = [];
    nextId = 0;
    constructor(windowsContainer, windowFrameFactory) {
        this.windowsContainer = windowsContainer;
        this.windowFrameFactory = windowFrameFactory;
        this.windowsContainer = windowsContainer;
    }
    async spawn(window, windowProps) {
        const frameParts = this.windowFrameFactory(windowProps);
        const { frame, getContent, ready } = frameParts;
        const instance = new WindowInstance(this.nextId, frame, document.createElement("div"), windowProps, window);
        this.instances.push(instance);
        this.nextId++;
        const controls = await ready;
        instance.setContent(getContent());
        instance.setControls(controls);
        return instance.api();
    }
    getWindow(id) {
        return this.instances.find((i) => i.id() === id)?.api();
    }
    getWindows() {
        return this.instances.map((i) => i.api());
    }
    kill(instance) {
        const index = this.instances.indexOf(instance);
        if (index !== -1) {
            instance.detachSignal();
            this.instances.splice(index, 1);
        }
    }
}
//# sourceMappingURL=WindowManager.js.map