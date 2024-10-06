import { Client } from '../../lib/client';
import { AdbMock } from '../../mockery/mockAdbServer';
import fs from 'fs';
import path from 'path';
import { LogcatReaderV2, PriorityV2 } from '../../lib/logcat';

describe('Open logcat OKAY tests', () => {
    const data = fs.readFileSync(
        path.join(__dirname, '../../mockery/data/output.log')
    );
    it('Should read logs and safely exit', async () => {
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                // TODO test passes with incorrect command
                cmd: `shell:echo && logcat -B *:I 2>/dev/null`,
                res: { value: data, raw: true }
            }
        ]);

        const port = await adbMock.start();
        const adb = new Client({ noAutoStart: true, port });
        const result = await adb.openLogcatV2('serial');

        expect(result).toBeInstanceOf(LogcatReaderV2);
        for await (const entry of result.logs()) {
            expect(entry.date).toBeInstanceOf(Date);
            expect(Number.isInteger(entry.pid)).toBe(true);
            expect(Number.isInteger(entry.tid)).toBe(true);
            expect(Object.values(PriorityV2)).toContain(entry.priority);
            expect(typeof entry.tag).toBe('string');
            expect(typeof entry.message).toBe('string');
        }
        await adbMock.end();
    });
});
