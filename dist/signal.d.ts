export type Signal<T> = {
    get(): T;
    set(v: T): void;
    subscribe(fn: (v: T) => void): () => void;
};
export declare function signal<T>(initial: T): Signal<T>;
//# sourceMappingURL=signal.d.ts.map