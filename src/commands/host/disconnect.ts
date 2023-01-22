import IpConnect from '../abstract/ipConnect';

export default class Disconnect extends IpConnect {
    Cmd = 'host:disconnect';
    protected Validator = /disconnected/;
    execute(host: string, port: number): Promise<string> {
        return super.execute(host, port);
    }
}
