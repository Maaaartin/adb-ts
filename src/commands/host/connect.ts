import IpConnect from '../abstract/ipConnect';

export default class Connect extends IpConnect {
    Cmd = 'host:connect';
    protected Validator = /connected to|already connected/;
    execute(host: string, port: number | string): Promise<string> {
        return super.execute(host, port);
    }
}
