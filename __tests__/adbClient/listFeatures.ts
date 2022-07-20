import AdbMock from '../../mockery/mockAdbServer';
import AdbClient from '../../lib/client';
import { DataMap } from '../../lib';

describe('List properties', () => {
    it('OKAY', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'shell:pm list features 2>/dev/null',
                res: `feature:one=1
feature:two=two
feature:three=false
feature:four=true
feature:five=null
feature:six`,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ noAutoStart: true, port });
            const result = await adb.listFeatures('serial');
            expect(result).toEqual(
                new DataMap([
                    ['one', 1],
                    ['two', 'two'],
                    ['three', false],
                    ['four', true],
                    ['five', null],
                    ['six', void 0]
                ])
            );
        } finally {
            await adbMock.end();
        }
    });
    //     it('FAIL first response', async () => {
    //         const adbMock = new AdbMock([
    //             { cmd: 'fail', res: null, rawRes: true },
    //             {
    //                 cmd: 'shell:getprop',
    //                 res: `[one]: [1]
    // [two]: [two]
    // [three]: [false]
    // [four]: [true]
    // [five]: [null]
    // [six]: []
    // [seven]: [Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)]`,
    //                 rawRes: true
    //             }
    //         ]);
    //         try {
    //             const port = await adbMock.start();
    //             const adb = new AdbClient({ noAutoStart: true, port });
    //             try {
    //                 await adb.listProperties('serial');
    //             } catch (e) {
    //                 expect(e.message).toBe('Failure');
    //             }
    //         } finally {
    //             await adbMock.end();
    //         }
    //     });

    //     it('FAIL first response', async () => {
    //         const adbMock = new AdbMock([
    //             { cmd: 'host:transport:serial', res: null, rawRes: true },
    //             {
    //                 cmd: 'fail',
    //                 res: `[one]: [1]
    // [two]: [two]
    // [three]: [false]
    // [four]: [true]
    // [five]: [null]
    // [six]: []
    // [seven]: [Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)]`,
    //                 rawRes: true
    //             }
    //         ]);
    //         try {
    //             const port = await adbMock.start();
    //             const adb = new AdbClient({ noAutoStart: true, port });
    //             try {
    //                 await adb.listProperties('serial');
    //             } catch (e) {
    //                 expect(e.message).toBe('Failure');
    //             }
    //         } finally {
    //             await adbMock.end();
    //         }
    //     });

    //     it('Unexpected first response', async () => {
    //         const adbMock = new AdbMock([
    //             {
    //                 cmd: 'host:transport:serial',
    //                 res: null,
    //                 rawRes: true,
    //                 unexpected: true
    //             },
    //             {
    //                 cmd: 'shell:getprop',
    //                 res: `[one]: [1]
    // [two]: [two]
    // [three]: [false]
    // [four]: [true]
    // [five]: [null]
    // [six]: []
    // [seven]: [Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)]`,
    //                 rawRes: true
    //             }
    //         ]);
    //         try {
    //             const port = await adbMock.start();
    //             const adb = new AdbClient({ noAutoStart: true, port });
    //             try {
    //                 await adb.listProperties('serial');
    //             } catch (e) {
    //                 expect(e.message).toBe(
    //                     "Unexpected 'ABCD', was expecting OKAY or FAIL"
    //                 );
    //             }
    //         } finally {
    //             await adbMock.end();
    //         }
    //     });

    //     it('Unexpected second response', async () => {
    //         const adbMock = new AdbMock([
    //             {
    //                 cmd: 'host:transport:serial',
    //                 res: null,
    //                 rawRes: true
    //             },
    //             {
    //                 cmd: 'shell:getprop',
    //                 res: `[one]: [1]
    // [two]: [two]
    // [three]: [false]
    // [four]: [true]
    // [five]: [null]
    // [six]: []
    // [seven]: [Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)]`,
    //                 rawRes: true,
    //                 unexpected: true
    //             }
    //         ]);
    //         try {
    //             const port = await adbMock.start();
    //             const adb = new AdbClient({ noAutoStart: true, port });
    //             try {
    //                 await adb.listProperties('serial');
    //             } catch (e) {
    //                 expect(e.message).toBe(
    //                     "Unexpected 'ABCD', was expecting OKAY or FAIL"
    //                 );
    //             }
    //         } finally {
    //             await adbMock.end();
    //         }
    //     });
});
