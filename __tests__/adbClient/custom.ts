import { AdbMock } from '../../mockery/mockAdbServer';
import Command from '../../lib/command';
import AdbClient from '../../lib/client';

class TestCmd extends Command {
    public execute(arg: string): Promise<null> {
        return this.initExecute(arg).then(this.handleReply(null));
    }
}

describe('Custom command tests', () => {
    it('Should execute command', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'test',
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new AdbClient({ port, noAutoStart: true });
            const result = await adb.custom(TestCmd, 'test');
            expect(result).toBeNull();
        } finally {
            adbMock.end();
        }
    });
});
