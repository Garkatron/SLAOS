import { Task } from "./Task";
import { ChannelsMap, UnsubscribeFn } from "../channel/Channel";
import { DispatchFn, Init, Update, View } from "../types";

abstract class Program<M> implements Init<M>, View<M>, Update<M> {
    private unsubs: UnsubscribeFn[] = [];

    abstract init(dispatch: DispatchFn<M>): Promise<Task<M> | undefined>;
    async stop(): Promise<Task<M> | undefined> {
        return;
    }
    async pause(): Promise<Task<M> | undefined> {
        return;
    }

    abstract update(message: M): Promise<Task<M> | undefined>;
    abstract view(root: HTMLElement, dispatch: DispatchFn<M>): void;

    protected wireChannels<C extends ChannelsMap>(
        channels: C,
        dispatch: DispatchFn<M>,
    ): void {
        for (const [key, channel] of Object.entries(channels)) {
            this.unsubs.push(
                channel.subscribe((event: any) =>
                    dispatch({ channel: key, ...event } as M),
                ),
            );
        }
    }

    detachChannels(): void {
        this.unsubs.forEach((u) => u());
        this.unsubs = [];
    }
}

export default Program;