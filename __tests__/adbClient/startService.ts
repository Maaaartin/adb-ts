import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import { UnexpectedDataError } from '../../lib/util';

describe('Start service', () => {
    it('OKAY without options', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service'
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with user', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice -n 'com.my.app/.Service' --user 1`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { user: 1 }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with action', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice -a 'action' -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { action: 'action' }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with data', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice -d 'data' -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { data: 'data' }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with data set to undefined', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { data: undefined }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with mime type', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice -t 'type' -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { mimeType: 'type' }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with single category', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice -c 'category' -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { category: 'category' }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with multiple categories', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice -c 'category1' -c 'category2' -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { category: ['category1', 'category2'] }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with flags', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice -f 0 -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { flags: 0 }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with null extra', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice --esn 'key' -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { extras: { key: 'key', type: 'null' } }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with bool extra', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice --ez 'key' true -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { extras: { key: 'key', type: 'bool', value: true } }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with int extra single value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice --ei 'key' 0 -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { extras: { key: 'key', type: 'int', value: 0 } }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with int extra array value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice --eia 'key' 0,1 -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { extras: { key: 'key', type: 'int', value: [0, 1] } }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with float extra single value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice --ef 'key' 0 -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { extras: { key: 'key', type: 'float', value: 0 } }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with float extra array value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice --efa 'key' 0,1 -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { extras: { key: 'key', type: 'float', value: [0, 1] } }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with long extra single value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice --el 'key' 0 -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { extras: { key: 'key', type: 'long', value: 0 } }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with long extra array value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice --ela 'key' 0,1 -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { extras: { key: 'key', type: 'long', value: [0, 1] } }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with string extra single value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice --es 'key' 'string' -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                { extras: { key: 'key', type: 'string', value: 'string' } }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with string extra array value', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice --esa 'key' 'string1','string2' -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                {
                    extras: {
                        key: 'key',
                        type: 'string',
                        value: ['string1', 'string2']
                    }
                }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with uri extra', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice --eu 'key' 'uri' -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                {
                    extras: {
                        key: 'key',
                        type: 'uri',
                        value: 'uri'
                    }
                }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with component', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice --ecn 'key' 'component' -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                {
                    extras: {
                        key: 'key',
                        type: 'component',
                        value: 'component'
                    }
                }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with extras array', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice --es 'key' 'string' --ei 'key2' 0 -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.startService(
                'serial',
                'com.my.app',
                'Service',
                {
                    extras: [
                        {
                            key: 'key',
                            type: 'string',
                            value: 'string'
                        },
                        {
                            key: 'key2',
                            type: 'int',
                            value: 0
                        }
                    ]
                }
            );
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Read error message', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `shell:am startservice -n 'com.my.app/.Service' --user 0`,
                res: 'Error: message\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.startService('serial', 'com.my.app', 'Service')
            ).rejects.toThrowError(new Error('message'));
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL first response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'fail', res: null, rawRes: true },
            {
                cmd: `shell:am startservice -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.startService('serial', 'com.my.app', 'Service')
            ).rejects.toThrowError(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL second response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: `fail`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.startService('serial', 'com.my.app', 'Service')
            ).rejects.toThrowError(new Error('Failure'));
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected first response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true,
                unexpected: true
            },
            {
                cmd: `shell:am startservice -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.startService('serial', 'com.my.app', 'Service')
            ).rejects.toThrowError(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected second response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:am startservice -n 'com.my.app/.Service' --user 0`,
                res: null,
                rawRes: true,
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() =>
                adb.startService('serial', 'com.my.app', 'Service')
            ).rejects.toThrowError(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });
});
