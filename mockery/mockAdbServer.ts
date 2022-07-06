import net from 'net';
import Parser from '../lib/parser';
import { encodeData, Reply } from '../lib';
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
    done: () => Promise<void>;
    port: number;
    write: (data: string) => void;
    writeData: (data: string) => void;
}> => {
    let socket_: net.Socket | null = null;
    const write_ = (reply: string | null = null, data: string): void => {
        const encoded = encodeData(data);
        const toWrite = (reply ?? '').concat(encoded.toString());
        socket_?.write(toWrite);
    };
    const server = await new Promise<net.Server>((resolve, reject) => {
        const server_ = new net.Server();
        server_.listen(0, () => {
            resolve(server_);
        });

        server_.on('connection', async (socket) => {
            socket_ = socket;
            const parser = new Parser(socket);
            const value = await parser.readValue();
            if (unexpected) {
                socket.write('YOYO');
            } else if (expValue === value.toString()) {
                write_(Reply.OKAY, res);
            } else {
                write_(Reply.FAIL, 'Failure');
            }
        });
        server_.once('error', reject);
    });
    const done = (): Promise<void> => {
        return promisify<void>((cb) => server?.close(cb) || cb(null))();
    };
    const write = (data: string): void => {
        write_(Reply.OKAY, data);
    };
    const writeData = (data: string): void => {
        write_(null, data);
    };
    const port = getPort(server);
    return { done, port, write, writeData };
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
