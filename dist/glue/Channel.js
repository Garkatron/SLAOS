export default class Channel {
    listeners = new Set();
    subscribe(fn) {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }
    notify(event) {
        this.listeners.forEach((fn) => fn(event));
    }
}
//# sourceMappingURL=Channel.js.map