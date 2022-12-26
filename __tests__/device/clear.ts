import { UnexpectedDataError } from '../../lib/util/errors';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Clear tests', () => {
    it('Should clear data with Success response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm clear com.something`,
                res: 'Success\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).clear('com.something');
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should clear data with Failed response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm clear com.something`,
                res: 'Failed\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            try {
                await getDevice(port).clear('com.something');
                fail('Expected failure');
            } catch (e) {
                expect(e).toEqual(
                    new Error(`Package 'com.something' could not be cleared`)
                );
            }
        } finally {
            await adbMock.end();
        }
    });

    it('Should clear data with unexpected response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: `shell:pm clear com.something`,
                res: 'Something\n',
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            try {
                await getDevice(port).clear('com.something');
                fail('Expected failure');
            } catch (e) {
                expect(e).toEqual(
                    new UnexpectedDataError('Something', '/^(Success|Failed)$/')
                );
            }
        } finally {
            await adbMock.end();
        }
    });
});
