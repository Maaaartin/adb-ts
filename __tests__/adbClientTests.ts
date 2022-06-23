import { ChildProcessMock } from '../mockery/mockChildProcess';
import AdbClient from '../lib/client.js';
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
    it('Start adb server', async () => {
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
                    cb(null, '', '');
                }
                return new ChildProcessMock();
            }
        );

        const client = new AdbClient();

        expect(client.startServer()).resolves;
    });
});
