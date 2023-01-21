import { UnexpectedDataError } from '../../lib/util';
import { Client } from '../../lib/client';
import { Connection } from '../../lib/connection';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Transport tests', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock({ cmd: 'host:transport:1234', res: null });
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
        const adbMock = new AdbMock({ cmd: 'host:transport:1234', res: null });
        try {
            const port = await adbMock.start();
            const client = new Client({
                noAutoStart: true,
                port
            });
            try {
                await client.transport('5678');
                fail('Expected Failure');
            } catch (e: any) {
                expect(e).toEqual(new Error('Failure'));
            }
        } finally {
            await adbMock.end();
        }
    });

    it('unexpected', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:transport:1234',
            res: null,
            unexpected: true
        });
        try {
            const port = await adbMock.start();
            const client = new Client({
                noAutoStart: true,
                port
            });
            try {
                await client.transport('5678');
                fail('Expected Failure');
            } catch (e: any) {
                expect(e).toEqual(
                    new UnexpectedDataError('UNEX', 'OKAY or FAIL')
                );
            }
        } finally {
            await adbMock.end();
        }
    });
});
