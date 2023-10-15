import { AdbMock } from '../../mockery/mockAdbServer';
import { Client } from '../../lib/client';
import { PropertyValue, UnexpectedDataError } from '../../lib/util';

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
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.listFeatures('serial');
            expect(result).toEqual(
                new Map<string, PropertyValue>([
                    ['one', 1],
                    ['two', 'two'],
                    ['three', false],
                    ['four', true],
                    ['five', null],
                    ['six', undefined]
                ])
            );
        } finally {
            await adbMock.end();
        }
    });
    it('FAIL first response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'fail', res: null, rawRes: true },
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
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.listFeatures('serial')).rejects.toEqual(
                new Error('Failure')
            );
        } finally {
            await adbMock.end();
        }
    });

    it('FAIL second response', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: null, rawRes: true },
            {
                cmd: 'fail',
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
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.listFeatures('serial')).rejects.toEqual(
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
                res: null,
                rawRes: true,
                unexpected: true
            },
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
            const adb = new Client({ noAutoStart: true, port });

            await expect(() => adb.listFeatures('serial')).rejects.toEqual(
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
                cmd: 'shell:pm list features 2>/dev/null',
                res: `feature:one=1
        feature:two=two
        feature:three=false
        feature:four=true
        feature:five=null
        feature:six`,
                rawRes: true,
                unexpected: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            await expect(() => adb.listFeatures('serial')).rejects.toEqual(
                new UnexpectedDataError('UNEX', 'OKAY or FAIL')
            );
        } finally {
            await adbMock.end();
        }
    });
});
