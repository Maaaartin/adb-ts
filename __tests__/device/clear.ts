import { UnexpectedDataError } from '../../lib/util';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Clear tests', () => {
    it('Should clear data with Success response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:pm clear com.something`,
                res: { value: 'Success\n', raw: true }
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
                res: { raw: true }
            },
            {
                cmd: `shell:pm clear com.something`,
                res: { value: 'Failed\n', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            await expect(() =>
                getDevice(port).clear('com.something')
            ).rejects.toEqual(
                new Error(`Package 'com.something' could not be cleared`)
            );
        } finally {
            await adbMock.end();
        }
    });

    it('Should clear data with unexpected response', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:pm clear com.something`,
                res: { value: 'Something\n', raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            await expect(() =>
                getDevice(port).clear('com.something')
            ).rejects.toEqual(
                new UnexpectedDataError('Something', '/^(Success|Failed)$/')
            );
        } finally {
            await adbMock.end();
        }
    });
});
