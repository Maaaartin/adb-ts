import { EventEmitter } from 'events';

export default abstract class StreamHandler extends EventEmitter {
    abstract end(): Promise<void>;
}
