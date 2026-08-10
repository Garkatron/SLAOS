import { ChannelsMap } from "../glue/types";
import { CanvasRenderer } from "./types";
export default abstract class Canvas<C extends ChannelsMap, S, V> {
    abstract channels: C;
    readonly abstract renderer: CanvasRenderer<V>;
    abstract view(state: S): V;
}
//# sourceMappingURL=Canvas.d.ts.map