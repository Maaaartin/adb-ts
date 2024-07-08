import EventEmitter from 'events';

const autoUnregister = async <T extends EventEmitter, R = void>(
    emitter: T | Promise<T>,
    action: Promise<R> | ((emitter: T) => Promise<R>)
): Promise<R> => {
    const emitter_ = await emitter;
    const getListeners = (): Map<
        string | symbol,
        ((...args: unknown[]) => void)[]
    > => {
        return emitter_
            .eventNames()
            .reduce(
                (map, event) => map.set(event, emitter_.listeners(event)),
                new Map()
            );
    };
    const prevListeners = getListeners();

    const promise = action instanceof Promise ? action : action(emitter_);
    const offListeners: [string | symbol, ((...args: unknown[]) => void)[]][] =
        [...getListeners()].map(([event, listeners]) => [
            event,
            listeners.filter(
                (listener) => !prevListeners.get(event)?.includes(listener)
            )
        ]);
    try {
        return await promise;
    } finally {
        offListeners.forEach(([event, listeners]) => {
            listeners.forEach((listener) => {
                emitter_.off(event, listener);
            });
        });
    }
};

export default autoUnregister;
