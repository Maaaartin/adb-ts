import ChildProcess from 'child_process';
import { EncodingOption } from 'fs';
import { ChildProcessMock } from '../../mockery/mockChildProcess';
import AdbClient from '../../lib/client';

const mockExec = (
    err: ChildProcess.ExecException | null,
    stderr: string,
    stdout: string
): void => {
    jest.spyOn(ChildProcess, 'execFile').mockImplementation(
        (
            _file: string,
            _args: ReadonlyArray<string> | undefined | null,
            cb:
                | (
                      | (EncodingOption & ChildProcess.ExecFileOptions)
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
                cb(err, stderr, stdout);
            }
            return new ChildProcessMock();
        }
    );
};

describe('Exec tests', () => {
    it('Should execute without error', async () => {
        mockExec(null, '', '');
        const adb = new AdbClient({ noAutoStart: true });
        const result = await adb.exec('cmd');
        expect(result).toBe('');
    });
});
