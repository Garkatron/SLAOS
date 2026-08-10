import { UpdateResult } from "../process/types";
import Channel from "./Channel";
export type EventMap = Record<string, any>;
export type UpdateFn<P> = (payload: P) => void;
export type ChannelUpdateFn<E extends EventMap, K extends keyof E, S> = (payload: E[K]) => UpdateResult<E[K], S>;
export type UnsubscribeFn = () => void;
export type EventMapFromUnion<U extends {
    type: PropertyKey;
}> = {
    [K in U["type"]]: Extract<U, {
        type: K;
    }> extends {
        payload: infer P;
    } ? P : never;
};
type Tagged<Channel extends string, E> = E extends {
    type: infer T;
    payload: infer P;
} ? {
    channel: Channel;
    type: T;
    payload: P;
} : never;
export type ChannelsMap = Record<string, Channel<any>>;
type EventOf<Ch extends Channel<any>> = Ch extends Channel<infer E> ? E : never;
export type EventsOf<C extends ChannelsMap> = {
    [K in keyof C]: Tagged<K & string, EventOf<C[K]>>;
}[keyof C];
export {};
//# sourceMappingURL=types.d.ts.map