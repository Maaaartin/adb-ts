import IpConnect from '../ipConnect';

export default class Disconnect extends IpConnect {
    protected cmd(): string {
        return 'host:disconnect';
    }
    protected validator(): RegExp {
        return /disconnected/;
    }
    execute(host: string, port: number | string): Promise<string> {
        return super.execute(host, port);
    }
}
