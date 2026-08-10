export function signal(initial) {
    let value = initial;
    const subs = new Set();
    return {
        get: () => value,
        set: (v) => { value = v; subs.forEach(fn => fn(v)); },
        subscribe: (fn) => { subs.add(fn); return () => subs.delete(fn); }
    };
}
//# sourceMappingURL=signal.js.map