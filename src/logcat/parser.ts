import { EventEmitter } from "events";

export default abstract class Parser extends EventEmitter {
    public abstract parse(...data: any[]): any;

}