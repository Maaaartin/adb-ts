import { AdbClient } from '../../lib/client';
import { AdbExecError } from '../../lib/util';
import { mockExec } from '../../mockery/execMock';

describe('Exec device tests', () => {
    it('Should execute without error', async () => {
        mockExec(null, '', '');
        const adb = new AdbClient({ noAutoStart: true });
        const result = await adb.execDevice('serial', 'cmd');
        expect(result).toBe('');
    });

    it('Should execute with error', async () => {
        mockExec(new Error('message'), '', '');
        const adb = new AdbClient({ noAutoStart: true });
        await expect(() =>
            adb.execDevice('serial', 'cmd')
        ).rejects.toThrowError(new Error('message'));
    });

    it('Should execute with std error', async () => {
        mockExec(null, '', 'message');
        const adb = new AdbClient({ noAutoStart: true });
        try {
            await adb.execDevice('serial', 'cmd');
        } catch (e: any) {
            expect(e.message).toBe('message');
            expect(e.command).toBe('-s serial cmd');
            expect(e).toBeInstanceOf(AdbExecError);
        }
    });

    it('Should execute with std out matching error reg exp', async () => {
        mockExec(null, 'Error: message', '');
        const adb = new AdbClient({ noAutoStart: true });
        try {
            await adb.execDevice('serial', 'cmd');
        } catch (e: any) {
            expect(e.message).toBe('Error: message');
            expect(e.command).toBe('-s serial cmd');
            expect(e).toBeInstanceOf(AdbExecError);
        }
    });
});
