import EventEmitter from 'events';

export default class EventDeregister<T extends EventEmitter> {
    private instance: T;
    private listeners: Map<string | symbol, ((...args: any[]) => void)[]> =
        new Map();
    constructor(instance: T) {
        this.instance = instance;
    }

    private getListeners(): Map<string | symbol, ((...args: any[]) => void)[]> {
        return this.instance
            .eventNames()
            .reduce(
                (map, event) => map.set(event, this.instance.listeners(event)),
                new Map()
            );
    }

    public register(cb: (instance: T) => T): void {
        this.listeners = this.getListeners();
        cb(this.instance);
    }

    public unregister(): void {
        const newListeners = this.getListeners();
        [...this.listeners.entries()].forEach(([event, listeners]) => {
            newListeners.get(event)?.forEach((l) => {
                if (!listeners.includes(l)) {
                    this.instance.off(event, l);
                }
            });
        });
    }
}
