export type Signal<T> = {
  get(): T;
  set(v: T): void;
  subscribe(fn: (v: T) => void): () => void;
};

export function signal<T>(initial: T): Signal<T> {
  let value = initial;
  const subs = new Set<(v: T) => void>();
  return {
    get: () => value,
    set: (v: T) => { value = v; subs.forEach(fn => fn(v)); },
    subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); }
  };
}
