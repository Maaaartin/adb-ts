import AdbMock from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { PropertyValue } from '../../lib';
import { UnexpectedDataError } from '../../lib';

describe('List settings tests', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'shell:settings list system',
                res: `one=1
two="two"
three=false
four=true
five=null
six=
seven=Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.listSettings('serial', 'system');
            expect(result).toEqual(
                new Map<string, PropertyValue>([
                    ['one', 1],
                    ['two', '"two"'],
                    ['three', false],
                    ['four', true],
                    ['five', null],
                    ['six', undefined],
                    [
                        'seven',
                        new Date(
                            'Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)'
                        )
                    ]
                ])
            );
        } finally {
            await adbMock.end();
        }
    });

    it('OKAY with non matching response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'shell:settings list system',
                res: 'test',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.listSettings('serial', 'system');
            expect(result).toEqual(new Map<string, PropertyValue>([]));
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL first response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'fail', res: null, rawRes: true },
            {
                cmd: 'shell:settings list system',
                res: `one=1
    two="two"
    three=false
    four=true
    five=null
    six=
    seven=Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.listSettings('serial', 'system');
                fail('Expected Failure');
            } catch (e) {
                expect(e).toEqual(new Error('Failure'));
            }
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL second response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'fail',
                res: `one=1
    two="two"
    three=false
    four=true
    five=null
    six=
    seven=Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.listSettings('serial', 'system');
                fail('Expected Failure');
            } catch (e) {
                expect(e).toEqual(new Error('Failure'));
            }
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
                cmd: 'shell:settings list system',
                res: `one=1
    two="two"
    three=false
    four=true
    five=null
    six=
    seven=Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.listSettings('serial', 'system');
                fail('Expected Failure');
            } catch (e) {
                expect(e).toEqual(
                    new UnexpectedDataError('ABCD', 'OKAY or FAIL')
                );
            }
        } finally {
            await adbMock.end();
        }
    });
    it('FAIL Unexpected first response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: 'shell:settings list system',
                res: `one=1
    two="two"
    three=false
    four=true
    five=null
    six=
    seven=Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)`,
                rawRes: true,
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            try {
                await adb.listSettings('serial', 'system');
                fail('Expected Failure');
            } catch (e) {
                expect(e).toEqual(
                    new UnexpectedDataError('ABCD', 'OKAY or FAIL')
                );
            }
        } finally {
            await adbMock.end();
        }
    });
});
