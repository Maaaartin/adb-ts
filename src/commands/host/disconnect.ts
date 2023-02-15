import { Connection } from '../../connection';
import IpConnect from '../abstract/ipConnect';

export default class Disconnect extends IpConnect {
    protected Validator = /disconnected/;
    constructor(connection: Connection, host: string, port: number) {
        super(connection, 'host:disconnect', host, port);
    }
}
