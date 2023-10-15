import { EventEmitter } from 'events';

export abstract class Parser extends EventEmitter {
    public abstract parse(...data: unknown[]): void;
}
