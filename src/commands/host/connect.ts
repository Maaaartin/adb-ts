import IpConnect from '../abstract/ipConnect';

export default class Connect extends IpConnect {
    protected Cmd = 'host:connect';
    protected Validator = /connected to|already connected/;
    execute(host: string, port: number): Promise<string> {
        return super.execute(host, port);
    }
}
