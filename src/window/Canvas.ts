import { ChannelsMap } from "../glue/types";
import { CanvasRenderer } from "./types";




// Take state and emit messages and return view;
// E = Event
// S = State
// V = View
export default abstract class Canvas<C extends ChannelsMap, S,  V> {

    abstract channels: C;
    readonly abstract renderer: CanvasRenderer<V>

    // Makes the view that will be renderer inside the target.
    abstract view(state: S): V;
}
/*
export abstract class Window<S = unknown, V = unknown> {
    readonly resizeable: boolean = true;
    readonly closeable: boolean = true;
    readonly minimizable: boolean = true;

    readonly stateSig?: Signal<S>;
    readonly renderer?: CanvasRenderer<V>;


    props: WindowProps = {
        height: 200,
        width: 200,
        initialX: "center",
        initialY: "center",
        title: "Default Title",
        debug: false,
    };

    // Allows the use of frameworks like Preact.
    abstract view(): V;

    render(parent: HTMLElement): void {
        const view = this.view();
        if (this.renderer) {
            this.renderer.update(parent, view);
        } else {
            parent.innerHTML = String(view);
        }
    }

    mount(parent: HTMLElement): void {
        const view = this.view();
        this.renderer?.mount(parent, view) ?? this.render(parent);
    }

    unmount(parent: HTMLElement): void {
        this.renderer?.unmount(parent);
    }
}
*/
