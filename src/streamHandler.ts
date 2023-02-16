import { EventEmitter } from 'events';

export default abstract class StreamHandler extends EventEmitter {
    public abstract end(): void;
}
