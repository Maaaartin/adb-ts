import { AdbClient } from '../../src';
import { mockExec } from '../../mockery/execMock';

describe('Client connection tests', () => {
    it('Should try to start server on ECONNREFUSED error', async () => {
        const mocked = mockExec(null);
        const client = new AdbClient();
        await expect(() => (client as any).connection()).rejects.toThrow();
        expect(mocked).toHaveBeenCalledTimes(1);
    });
});
