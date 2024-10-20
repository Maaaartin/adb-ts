import MockCommand from '../mockery/mockCommand';
import { Connection } from '../lib/connection';
import { Parser } from '../lib/parser';
import { AdbMock } from '../mockery/mockAdbServer';
import { UnexpectedDataError } from '../lib/util';
import LogcatCommandV2 from '../lib/commands/host-transport/logcatV2';
import { TextParser, TextParserGrouped } from '../lib/logcat/parser';

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
        const adbMock = new AdbMock({ cmd: 'mock' });
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
        const adbMock = new AdbMock({ res: 'fail' });

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
            res: 'unexpected'
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

describe('Logcat commands', () => {
    it('should have TextParser when logs are not grouped', () => {
        const command = new LogcatCommandV2(new Connection(), '');
        expect(command).toHaveProperty('parserClass', TextParser);
    });

    it('should have TextParserGrouped when logs are grouped', () => {
        const command = new LogcatCommandV2(new Connection(), '', {
            groupLogs: true
        });
        expect(command).toHaveProperty('parserClass', TextParserGrouped);
    });
});
