import TransportCommand from '../../lib/commands/abstract/transport';
import { AdbMock } from '../../mockery/mockAdbServer';
import { getDevice } from '../../mockery/testDevice';

class TestCmd extends TransportCommand<null> {
    protected keepAlive = false;
    protected Cmd = 'test ';
    protected postExecute(): Promise<null> {
        return Promise.resolve(null);
    }
    public execute(serial: string, arg: string): Promise<null> {
        this.Cmd += arg;
        return this.preExecute(serial);
    }
}
describe('Device custom command tests', () => {
    it('Should execute custom command', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'host:transport:serial',
                res: null,
                rawRes: true
            },
            {
                cmd: 'test arg',
                res: null,
                rawRes: true
            }
        ]);
        try {
            const port = await adbMock.start();
            const result = await getDevice(port).custom(TestCmd, 'arg');
            expect(result).toBeNull();
        } finally {
            await adbMock.end();
        }
    });
});
