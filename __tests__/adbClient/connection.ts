import { Client } from '../../lib';
import { mockExec } from '../../mockery/execMock';

describe('Client connection tests', () => {
    it('Should try to start server on ECONNREFUSED error', async () => {
        const mocked = mockExec(null);
        const client = new Client({ port: 1 });
        await expect(() => client['connection']()).rejects.toThrow();
        expect(mocked).toHaveBeenCalledTimes(1);
    });
});
