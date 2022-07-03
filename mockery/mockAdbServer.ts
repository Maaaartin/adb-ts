import net from 'net';
import Parser from '../lib/parser';
import { encodeLength } from '../lib';
import Connection from '../lib/connection';
import { promisify } from 'util';

export const mockServer = (epxValue: string, unexpected = false) => {
    return new Promise<net.Server>((resolve, reject) => {
        const server = new net.Server();
        server.listen(0, () => {
            resolve(server);
        });
        server.on('connection', async (socket) => {
            const parser = new Parser(socket);
            const value = await parser.readValue();
            if (unexpected) {
                socket.write('YOYO');
            } else if (epxValue === value.toString()) {
                socket.write('OKAY');
            } else {
                const err = 'Failure';
                const hex = encodeLength(err.length);
                socket.write(`FAIL${hex}Failure`);
            }
        });
        server.once('error', reject);
    });
};

export const getPort = (server: net.Server): number => {
    const info = server.address();
    if (typeof info === 'string' || info === null) {
        throw new Error('Could not get server port');
    }
    return info.port;
};

export const endConnections = async (server: net.Server | null) => {
    await promisify<void>((cb) => server?.close(cb) || cb(null))();
};
