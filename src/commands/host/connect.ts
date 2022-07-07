import IpConnect from '../ipConnect';

export default class Connect extends IpConnect {
    protected cmd(): string {
        return 'host:connect';
    }
    protected validator(): RegExp {
        return /connected to|already connected/;
    }
    execute(host: string, port: number | string): Promise<string> {
        return super.execute(host, port);
    }
}
