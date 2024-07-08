import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import { PropertyValue, UnexpectedDataError } from '../../lib/util';

describe('List properties', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'shell:getprop',
                res: `[one]: [1]
[two]: [two]
[three]: [false]
[four]: [true]
[five]: [null]
[six]: []
[seven]: [Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)]`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.listProperties('serial');
            expect(result).toEqual(
                new Map<string, PropertyValue>([
                    ['one', 1],
                    ['two', 'two'],
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

    it('FAIL first response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'fail', res: { raw: true } },
            {
                cmd: 'shell:getprop',
                res: `[one]: [1]
[two]: [two]
[three]: [false]
[four]: [true]
[five]: [null]
[six]: []
[seven]: [Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)]`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.listProperties('serial')).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL second response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: 'fail',
                res: `[one]: [1]
[two]: [two]
[three]: [false]
[four]: [true]
[five]: [null]
[six]: []
[seven]: [Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)]`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });

            await expect(() => adb.listProperties('serial')).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Unexpected first response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true },
                unexpected: true
            },
            {
                cmd: 'shell:getprop',
                res: `[one]: [1]
[two]: [two]
[three]: [false]
[four]: [true]
[five]: [null]
[six]: []
[seven]: [Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)]`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.listProperties('serial')).rejects.toEqual(
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
                res: { raw: true }
            },
            {
                cmd: 'shell:getprop',
                res: `[one]: [1]
[two]: [two]
[three]: [false]
[four]: [true]
[five]: [null]
[six]: []
[seven]: [Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)]`,
                rawRes: true,
                unexpected: true
            }
        ]);

        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.listProperties('serial')).rejects.toEqual(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });
});
