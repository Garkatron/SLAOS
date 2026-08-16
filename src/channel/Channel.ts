export type UnsubscribeFn = () => void;

export type ChannelsMap = Record<string, Channel<any>>;

type EventOf<Ch extends Channel<any>> = Ch extends Channel<infer E> ? E : never;
type Tagged<C extends string, E> = { channel: C } & E;

export type EventsOf<C extends ChannelsMap> = {
    [K in keyof C]: Tagged<K & string, EventOf<C[K]>>;
}[keyof C];

export class Channel<E> {
    private listeners = new Set<(event: E) => void>();

    subscribe(fn: (event: E) => void): UnsubscribeFn {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }

    notify(event: E): void {
        this.listeners.forEach((fn) => fn(event));
    }
}