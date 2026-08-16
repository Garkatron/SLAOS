import { View } from "../types";
import { Window } from "./Window";
import { FrameParts, WindowID, WindowProps } from "./types";

export class WindowManager {
    private instances: Window<any, any>[] = [];
    private nextId: WindowID = 0;

    constructor(
        private windowsContainer: HTMLElement,
        private windowFrameFactory: <P extends WindowProps>(
            props: P,
        ) => FrameParts,
    ) {}

    async spawn<P extends WindowProps, M>(
        viewImpl: View<M>,
        windowProps: P,
    ): Promise<Window<P, M>> {
        const frameParts = this.windowFrameFactory<P>(windowProps);
        const { frame, getContent, ready } = frameParts;

        const instance = new Window<P, M>(
            this.nextId,
            frame,
            document.createElement("div"),
            windowProps,
            viewImpl,
        );
        this.instances.push(instance);
        this.nextId++;

        const controls = await ready;

        instance.setContent(getContent());
        instance.setControls(controls);

        return instance;
    }

    getWindow(id: WindowID): Window<any, any> | undefined {
        return this.instances.find((i) => i.id === id);
    }

    getWindows(): Window<any, any>[] {
        return [...this.instances];
    }

    kill(instance: Window<any, any>): void {
        const index = this.instances.indexOf(instance);
        if (index !== -1) {
            instance.close();
            this.instances.splice(index, 1);
        }
    }

    killById(id: WindowID): void {
        const instance = this.getWindow(id);
        if (instance) this.kill(instance);
    }
}