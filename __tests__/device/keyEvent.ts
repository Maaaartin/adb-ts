import { KeyCode } from '../../lib/util';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

describe('Device key event tests', () => {
    it('Should input key event', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:input keyboard keyevent 37`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).keyEvent(37);
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should input key event with multiple events', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:input keyboard keyevent 37 37 42`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).keyEvent([
                37,
                37,
                KeyCode.KEYCODE_N
            ]);
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });

    it('Should input key event with options', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: { raw: true }
            },
            {
                cmd: `shell:input keyboard keyevent --doubletap 37`,
                res: { raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).keyEvent(37, {
                variant: 'doubletap'
            });
            expect(result).toBeUndefined();
        } finally {
            await adbMock.end();
        }
    });
});
