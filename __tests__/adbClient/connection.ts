import { Client } from '../../lib';
import { execFile } from 'child_process';

jest.mock('child_process', () => ({
    execFile: jest.fn()
}));

const mockExecFile = execFile as unknown as jest.Mock;

describe('Client connection tests', () => {
    it('Should try to start server on ECONNREFUSED error', async () => {
        mockExecFile.mockImplementation((_cmd, _args, callback_) => {
            callback_(null, '', '');
        });
        const client = new Client({ port: 1 });
        await expect(() => client['connection']()).rejects.toThrow();
        expect(mockExecFile).toHaveBeenCalledTimes(1);
    });
});
