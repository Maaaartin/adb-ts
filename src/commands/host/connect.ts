import { Connection } from '../../connection';
import IpConnect from '../abstract/ipConnect';

export default class Connect extends IpConnect {
    protected Validator = /connected to|already connected/;
    constructor(connection: Connection, host: string, port: number) {
        super(connection, 'host:connect', host, port);
    }
}
