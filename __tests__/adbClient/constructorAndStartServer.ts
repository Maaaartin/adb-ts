import { ChildProcessMock } from '../../mockery/mockChildProcess';
import AdbClient from '../../lib/client';
import ChildProcess from 'child_process';
import { BaseEncodingOptions } from 'fs';

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
