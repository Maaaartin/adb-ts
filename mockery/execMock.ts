import ChildProcess from 'child_process';
import { EncodingOption } from 'fs';
import { ChildProcessMock } from './mockChildProcess';

export const mockExec = (
    err: ChildProcess.ExecException | null,
    stdout = '',
    stderr = ''
): jest.SpyInstance<ChildProcess.ChildProcess> => {
    return jest
        .spyOn(ChildProcess, 'execFile')
        .mockImplementation(
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
                    cb(err, stdout, stderr);
                }
                return new ChildProcessMock();
            }
        );
};
