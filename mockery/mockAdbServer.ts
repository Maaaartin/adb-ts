import net from 'net';
import Parser from '../lib/parser';
import { encodeLength } from '../lib';
import { promisify } from 'util';

type MockServerOptions = {
    expValue: string;
    unexpected?: boolean;
    res?: string;
};
export const mockServer = async ({
    expValue,
    unexpected = false,
    res = ''
}: MockServerOptions): Promise<{
    server: net.Server;
    done: () => Promise<void>;
    port: number;
}> => {
    const server = await new Promise<net.Server>((resolve, reject) => {
        const server_ = new net.Server();
        server_.listen(0, () => {
            resolve(server_);
        });
        server_.on('connection', async (socket) => {
            const parser = new Parser(socket);
            const value = await parser.readValue();
            if (unexpected) {
                socket.write('YOYO');
            } else if (expValue === value.toString()) {
                const bytes = encodeLength(res.length);
                socket.write(`OKAY${bytes}${res}`);
            } else {
                const err = 'Failure';
                const bytes = encodeLength(err.length);
                socket.write(`FAIL${bytes}${err}`);
            }
        });
        server_.once('error', reject);
    });
    const done = (): Promise<void> => {
        return promisify<void>((cb) => server?.close(cb) || cb(null))();
    };
    const port = getPort(server);
    return { server, done, port };
};

export const getPort = (server: net.Server): number => {
    const info = server.address();
    if (typeof info === 'string' || info === null) {
        throw new Error('Could not get server port');
    }
    return info.port;
};

export const endConnections = async (
    server: net.Server | null
): Promise<void> => {
    await promisify<void>((cb) => server?.close(cb) || cb(null))();
};
