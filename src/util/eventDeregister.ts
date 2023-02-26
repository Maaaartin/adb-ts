import EventEmitter from 'events';

export default class EventUnregister<T extends EventEmitter> {
    private instance: T;
    private offListeners: [string | symbol, ((...args: any[]) => void)[]][] =
        [];
    constructor(instance: T) {
        this.instance = instance;
    }

    private getListenerMap(): Map<
        string | symbol,
        ((...args: any[]) => void)[]
    > {
        return this.instance
            .eventNames()
            .reduce(
                (map, event) => map.set(event, this.instance.listeners(event)),
                new Map()
            );
    }

    public register(cb: (instance: T) => T): void {
        const prevListeners = this.getListenerMap();
        cb(this.instance);

        this.offListeners = [...this.getListenerMap()].map(
            ([event, listeners]) => [
                event,
                listeners.filter(
                    (listener) => !prevListeners.get(event)?.includes(listener)
                )
            ]
        );
    }

    private unregister(): void {
        this.offListeners.forEach(([event, listeners]) => {
            listeners.forEach((listener) => {
                this.instance.off(event, listener);
            });
        });
    }

    public async unregisterAfter<U>(promise: Promise<U>): Promise<U> {
        try {
            return await promise;
        } finally {
            this.unregister();
        }
    }
}
