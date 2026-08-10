import { UnsubscribeFn } from "./types";
export default class Channel<E> {
    private listeners;
    subscribe(fn: (event: E) => void): UnsubscribeFn;
    notify(event: E): void;
}
//# sourceMappingURL=Channel.d.ts.map