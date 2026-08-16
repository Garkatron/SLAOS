import { UpdateResult } from "../process/types";
import { ChannelUpdateFn, EventMap, UnsubscribeFn } from "./types";


export default class Channel<E> {
    private listeners = new Set<(event: E) => void>();

    subscribe(fn: (event: E) => void): UnsubscribeFn {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }

    notify(event: E): void {
        this.listeners.forEach((fn) => fn(event));
    }
}
