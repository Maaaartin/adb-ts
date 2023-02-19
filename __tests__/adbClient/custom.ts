import { AdbMock } from '../../mockery/mockAdbServer';
import Command from '../../lib/commands/command';
import { Client } from '../../lib/client';
import { Connection } from '../../lib/connection';

class TestCmd extends Command<null> {
    protected autoEnd = true;
    private arg: string;
    constructor(connection: Connection, arg: string) {
        super(connection);
        this.arg = arg;
    }
    public async execute(): Promise<null> {
        await this.initAndValidateReply(this.arg);
        return null;
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
            const adb = new Client({ port, noAutoStart: true });
            const result = await adb.custom(TestCmd, 'test');
            expect(result).toBeNull();
        } finally {
            adbMock.end();
        }
    });
});
