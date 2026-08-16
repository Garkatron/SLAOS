import { WindowProps } from "./types";

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
