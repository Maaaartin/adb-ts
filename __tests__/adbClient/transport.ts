import AdbClient from '../../lib/client.js';
import net from 'net';
import Connection from '../../lib/connection';
import {
    endConnections,
    getPort,
    mockServer
} from '../../mockery/mockAdbServer';

describe('Transport tests', () => {
    it('Transport OKAY', async () => {
        let server: net.Server | null = null;
        try {
            server = await mockServer('host:transport:1234');
            const client = new AdbClient({
                noAutoStart: true,
                port: getPort(server)
            });
            const connection = await client.transport('1234');
            expect(connection).toBeInstanceOf(Connection);
        } finally {
            await endConnections(server);
        }
    });

    it('Transport FAIL', async () => {
        let server: net.Server | null = null;
        try {
            server = await mockServer('host:transport:1234');
            const client = new AdbClient({
                noAutoStart: true,
                port: getPort(server)
            });
            try {
                await client.transport('5678');
            } catch (e) {
                expect(e.message).toBe('Failure');
            }
        } finally {
            await endConnections(server);
        }
    });

    it('Transport unexpected', async () => {
        let server: net.Server | null = null;
        try {
            server = await mockServer('host:transport:1234', true);
            const client = new AdbClient({
                noAutoStart: true,
                port: getPort(server)
            });
            try {
                await client.transport('5678');
            } catch (e) {
                expect(e.message).toBe(
                    "Unexpected 'YOYO', was expecting OKAY or FAIL"
                );
            }
        } finally {
            await endConnections(server);
        }
    });
});
