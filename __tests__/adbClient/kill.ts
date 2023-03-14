import { Client } from '../../lib/client';
import { UnexpectedDataError } from '../../lib/util';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Kill server tests', () => {
    it('Should kill server', async () => {
        const adbMock = new AdbMock({ cmd: 'host:kill', res: null });
        try {
            const port = await adbMock.start();
            const client = new Client({
                noAutoStart: true,
                port
            });
            const result = await client.kill();
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should throw error after failure', async () => {
        const adbMock = new AdbMock({
            cmd: 'fail',
            res: null
        });
        try {
            const port = await adbMock.start();
            const client = new Client({
                noAutoStart: true,
                port
            });
            await expect(() => client.kill()).rejects.toThrowError(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Should throw UnexpectedDataError', async () => {
        const adbMock = new AdbMock({
            cmd: 'host:kill',
            res: null,
            unexpected: true
        });
        try {
            const port = await adbMock.start();
            const client = new Client({
                noAutoStart: true,
                port
            });
            await expect(() => client.kill()).rejects.toThrowError(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });
});
