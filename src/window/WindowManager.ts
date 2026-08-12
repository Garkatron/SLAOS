import Canvas from "./Canvas";
import { FrameParts, WindowHandle, WindowControls, WindowProps, WindowInstanceId } from "./types";
import { WindowInstance } from "./Window";

export class WindowManager {
    instances: WindowInstance<any>[] = [];
    nextId: WindowInstanceId = 0;

    constructor(
        private windowsContainer: HTMLElement,
        private windowFrameFactory: <P extends WindowProps>(props: P) => FrameParts,
    ) {
        this.windowsContainer = windowsContainer;
    }

    async spawn<P extends WindowProps>(window: Canvas<any, any>, windowProps: P): Promise<WindowHandle> {
        const frameParts = this.windowFrameFactory<P>(windowProps);
        const { frame, getContent, ready } = frameParts;

        const instance = new WindowInstance(this.nextId, frame, document.createElement("div"), windowProps, window);
        this.instances.push(instance);
        this.nextId++;

        const controls = await ready;

        instance.setContent(getContent());
        instance.setControls(controls);

        return instance.api();
    }

    getWindow(id: WindowInstanceId): WindowHandle | undefined {
        return this.instances.find((i) => i.id() === id)?.api();
    }

    getWindows(): WindowHandle[] {
        return this.instances.map((i) => i.api());
    }

    kill(instance: WindowInstance<any>) {
        const index = this.instances.indexOf(instance);
        if (index !== -1) {
            instance.detachSignal();
            this.instances.splice(index, 1);
        }
    }
}
