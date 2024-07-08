import { Client } from '../../lib/client';
import { UnexpectedDataError } from '../../lib/util';
import { AdbMock } from '../../mockery/mockAdbServer';

describe('Kill server tests', () => {
    it('Should kill server', async () => {
        const adbMock = new AdbMock({ cmd: 'host:kill' });
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

    it('Should ignore error when cannot connect to server', async () => {
        new AdbMock({ cmd: 'host:kill' });
        const client = new Client({
            noAutoStart: true
        });
        const result = await client.kill();
        expect(result).toBeUndefined();
    });

    it('Should throw error after failure', async () => {
        const adbMock = new AdbMock({
            res: 'fail'
        });
        try {
            const port = await adbMock.start();
            const client = new Client({
                noAutoStart: true,
                port
            });
            await expect(() => client.kill()).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Should throw UnexpectedDataError', async () => {
        const adbMock = new AdbMock({
            res: 'unexpected'
        });
        try {
            const port = await adbMock.start();
            const client = new Client({
                noAutoStart: true,
                port
            });
            await expect(() => client.kill()).rejects.toEqual(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });
});
