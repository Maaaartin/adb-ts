import { UnexpectedDataError } from '../../lib/util';
import { Client } from '../../lib/client';
import { Connection } from '../../lib/connection';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Transport tests', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock({ cmd: 'host:transport:1234' });
        try {
            const port = await adbMock.start();
            const client = new Client({
                noAutoStart: true,
                port
            });
            const connection = await client.transport('1234');
            expect(connection).toBeInstanceOf(Connection);
            connection.end();
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL', async () => {
        const adbMock = new AdbMock({ res: 'fail' });
        try {
            const port = await adbMock.start();
            const client = new Client({
                noAutoStart: true,
                port
            });
            await expect(() => client.transport('5678')).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('unexpected', async () => {
        const adbMock = new AdbMock({
            res: 'unexpected'
        });
        try {
            const port = await adbMock.start();
            const client = new Client({
                noAutoStart: true,
                port
            });
            await expect(() => client.transport('5678')).rejects.toEqual(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });
});
