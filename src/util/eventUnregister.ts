import EventEmitter from 'events';

export default class EventUnregister<T extends EventEmitter> {
    private instance: T;
    private offListeners: [
        string | symbol,
        ((...args: unknown[]) => void)[]
    ][] = [];
    constructor(instance: T) {
        this.instance = instance;
    }

    private getListenerMap(): Map<
        string | symbol,
        ((...args: unknown[]) => void)[]
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

export const autoUnregister = async <T extends EventEmitter>(
    emitter: T,
    action: (emitter: T) => Promise<void>
): Promise<void> => {
    const getListeners = (): Map<
        string | symbol,
        ((...args: unknown[]) => void)[]
    > => {
        return emitter
            .eventNames()
            .reduce(
                (map, event) => map.set(event, emitter.listeners(event)),
                new Map()
            );
    };
    const prevListeners = getListeners();

    const promise = action(emitter);
    const offListeners: [string | symbol, ((...args: unknown[]) => void)[]][] =
        [...getListeners()].map(([event, listeners]) => [
            event,
            listeners.filter(
                (listener) => !prevListeners.get(event)?.includes(listener)
            )
        ]);
    try {
        await promise;
    } finally {
        offListeners.forEach(([event, listeners]) => {
            listeners.forEach((listener) => {
                emitter.off(event, listener);
            });
        });
    }
};
