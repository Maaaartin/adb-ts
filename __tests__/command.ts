import MockCommand from '../mockery/mockCommand';
import Connection from '../lib/connection';
import Parser from '../lib/parser';
import { AdbMock } from '../mockery/mockAdbServer';
import { UnexpectedDataError } from '../lib';

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
describe('Escape tests', () => {
    const connection = new Connection();
    const cmd = new MockCommand(connection);
    it('escape undefined', () => {
        const result = cmd.escape(undefined);
        expect(result).toBe("''");
    });
    it('escape string', () => {
        const result = cmd.escape("'test'");
        expect(result).toBe(`''"'"'test'"'"''`);
    });
    it('escape number', () => {
        const result = cmd.escape(1);
        expect(result).toBe(`${1}`);
    });
    it('escape null', () => {
        const result = cmd.escape(null);
        expect(result).toBe(`${null}`);
    });
    it('escape bool', () => {
        const result = cmd.escape(true);
        expect(result).toBe(`${true}`);
    });
});

describe('Escape compat tests', () => {
    const connection = new Connection();
    const cmd = new MockCommand(connection);
    it('escape undefined', () => {
        const result = cmd.escapeCompat(undefined);
        expect(result).toBe("''");
    });
    it('escape string', () => {
        const result = cmd.escapeCompat('"test"');
        expect(result).toBe('"\\"test\\""');
    });
    it('escape number', () => {
        const result = cmd.escapeCompat(1);
        expect(result).toBe(`${1}`);
    });
    it('escape null', () => {
        const result = cmd.escapeCompat(null);
        expect(result).toBe(`${null}`);
    });
    it('escape bool', () => {
        const result = cmd.escapeCompat(true);
        expect(result).toBe(`${true}`);
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
            try {
                await cmd.execute();
                fail('Expected Failure');
            } catch (e: any) {
                expect(e.message).toBe('Failure');
            }
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
            } catch (e: any) {
                expect(e).toBeInstanceOf(UnexpectedDataError);
                expect(e.message).toBe(
                    "Unexpected 'UNEX', was expecting OKAY or FAIL"
                );
            }
        } finally {
            await adbMock.end();
        }
    });
});
