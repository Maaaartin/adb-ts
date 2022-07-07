import IpConnect from '../ipConnect';

export default class Disconnect extends IpConnect {
    protected validator(): RegExp {
        return /disconnected/;
    }
    execute(host: string, port: number | string): Promise<string> {
        return super.execute('host:disconnect', host, port);
    }
}
