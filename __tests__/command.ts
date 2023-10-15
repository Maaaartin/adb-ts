import MockCommand from '../mockery/mockCommand';
import { Connection } from '../lib/connection';
import { Parser } from '../lib/parser';
import { AdbMock } from '../mockery/mockAdbServer';
import { UnexpectedDataError } from '../lib/util';

describe('Constructor tests', () => {
    it('Test parser', () => {
        const connection = new Connection();
        const cmd = new MockCommand(connection);
        expect(cmd.parser).toBeInstanceOf(Parser);
    });
    it('Test connection', () => {
        const connection = new Connection();
        const cmd = new MockCommand(connection);
        expect(cmd.connection).toBeInstanceOf(Connection);
    });
});

describe('Handle response', () => {
    const getConnection = (port: number): Promise<Connection> => {
        return new Promise((resolve, reject) => {
            const conn = new Connection();
            conn.once('connect', () => {
                resolve(conn);
            });
            conn.once('error', reject);
            conn.connect({ port });
        });
    };
    it('OKAY', async () => {
        const adbMock = new AdbMock({ cmd: 'mock', res: null });
        try {
            const port = await adbMock.start();
            const conn = await getConnection(port);
            const cmd = new MockCommand(conn);
            const result = await cmd.execute();
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL', async () => {
        const adbMock = new AdbMock({ cmd: 'wrong value', res: null });

        try {
            const port = await adbMock.start();
            const conn = await getConnection(port);
            const cmd = new MockCommand(conn);
            await expect(() => cmd.execute()).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected', async () => {
        const adbMock = new AdbMock({
            cmd: 'mock',
            res: null,
            unexpected: true
        });

        try {
            const port = await adbMock.start();
            const conn = await getConnection(port);
            const cmd = new MockCommand(conn);
            try {
                await cmd.execute();
            } catch (e: unknown) {
                expect(e).toEqual(
                    new UnexpectedDataError('UNEX', 'OKAY or FAIL')
                );
            }
        } finally {
            await adbMock.end();
        }
    });
});
