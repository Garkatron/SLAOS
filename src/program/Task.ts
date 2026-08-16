/**
 * A promise factory.
 */
export type Task<M> = () => Promise<M>;

const Task = {
    /**
     * Wraps an existent promise into another promise.
     */
    fromPromise: <M>(p: Promise<M>): Task<M> => () => p,
    /**
     * Takes a promise factory.
     */
    from: <M>(thunk: () => Promise<M>): Task<M> => thunk,
    /**
     * Wraps a constant value.
     * Useful for testing.
     */
    of: <M>(value: M): Task<M> => () => Promise.resolve(value),
};
