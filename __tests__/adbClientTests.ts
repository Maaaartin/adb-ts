import { ChildProcessMock } from '../mockery/mockChildProcess';
import AdbClient from '../lib/client.js';
import ChildProcess from 'child_process';
import { BaseEncodingOptions } from 'fs';
import net from 'net';
import Parser from '../lib/parser';
import { promisify } from 'util';
import Connection from '../lib/connection';
import { encodeLength } from '../lib';

describe('Client constructor tests', () => {
    it('Create Adb client instance', () => {
        const client = new AdbClient();
        expect(client.options).toEqual({
            port: 5037,
            host: 'localhost',
            bin: 'adb',
            noAutoStart: false
        });
    });

    it('Create Adb client instance with options', () => {
        const client = new AdbClient({ bin: undefined, port: 5036 });
        expect(client.options).toEqual({
            port: 5036,
            host: 'localhost',
            bin: 'adb',
            noAutoStart: false
        });
    });
});

describe('Start server tests', () => {
    const mockExec = (err: ChildProcess.ExecException | null) => {
        jest.spyOn(ChildProcess, 'execFile').mockImplementation(
            (
                _file: string,
                _args: ReadonlyArray<string> | undefined | null,
                cb:
                    | (
                          | (BaseEncodingOptions & ChildProcess.ExecFileOptions)
                          | undefined
                          | null
                      )
                    | ((
                          error: ChildProcess.ExecException | null,
                          stdout: string,
                          stderr: string
                      ) => void)
            ) => {
                if (typeof cb === 'function') {
                    cb(err, '', '');
                }
                return new ChildProcessMock();
            }
        );
    };

    it('Start adb server', () => {
        mockExec(null);
        const client = new AdbClient();
        expect(client.startServer()).resolves;
    });

    it('Start adb server error', async () => {
        try {
            mockExec(new Error('message'));
            const client = new AdbClient();
            await client.startServer();
        } catch (e) {
            expect(e.message).toBe('message');
        }
    });

    it('Start adb server callback overload', () => {
        mockExec(null);
        const client = new AdbClient();
        client.startServer((err) => {
            expect(err).toBe(null);
        });
    });

    it('Start adb server callback overload error', () => {
        mockExec(new Error('message'));
        const client = new AdbClient();
        client.startServer((err) => {
            expect(err).toBeInstanceOf(Error);
        });
    });
});

describe('Transport tests', () => {
    const mockServer = (epxValue: string) => {
        return new Promise<net.Server>((resolve, reject) => {
            const server = new net.Server();
            server.listen(0, () => {
                resolve(server);
            });
            server.on('connection', async (socket) => {
                const parser = new Parser(socket);
                const value = await parser.readValue();
                if (epxValue === value.toString()) {
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

    const getPort = (server: net.Server): number => {
        const info = server.address();
        if (typeof info === 'string' || info === null) {
            throw new Error('Could not get server port');
        }
        return info.port;
    };

    it('Test Transport', async () => {
        let server: net.Server | null = null,
            connection: Connection | null = null;
        try {
            server = await mockServer('host:transport:1234');
            const port = getPort(server);
            const client = new AdbClient({ noAutoStart: true, port: port });
            connection = await client.transport('1234');
            expect(connection).toBeInstanceOf(Connection);
        } finally {
            await promisify<void>((cb) => {
                if (connection) {
                    return connection?.end(() => cb(null));
                }
                return cb(null);
            })();

            await promisify<void>((cb) => server?.close(cb))();
        }
    });
});
