import { AdbMock } from '../../mockery/mockAdbServer';
import Command from '../../lib/commands/command';
import { Client } from '../../lib/client';
import { Connection } from '../../lib/connection';
import { Reply } from '../../lib/util';

class TestCmd extends Command<number> {
    protected autoEnd = true;
    private arg: string;
    constructor(connection: Connection, arg: string) {
        super(connection);
        this.arg = arg;
    }
    async execute(): Promise<number> {
        const reply = await this.initExecute(this.arg);
        switch (reply) {
            case Reply.OKAY:
                const value = await this.parser.readValue();
                return parseInt(value.toString(), 10);
            case Reply.FAIL:
                throw await this.parser.readError();
            default:
                return parseInt(reply, 10);
        }
    }
}

describe('Custom command tests', () => {
    it('Should execute command', async () => {
        const adbMock = new AdbMock([
            {
                cmd: 'test',
                res: '10'
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ port, noAutoStart: true });
            const result = await adb.custom(TestCmd, 'test');
            expect(result).toBe(10);
        } finally {
            adbMock.end();
        }
    });
});
