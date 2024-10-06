import { Client } from '../../lib/client';
import { AdbMock } from '../../mockery/mockAdbServer';
import fs from 'fs/promises';
import path from 'path';
import { LogcatReaderV2 } from '../../lib/logcat';

const readFile = (
    dir: string,
    file: 'raw.log' | 'output.json'
): Promise<Buffer> =>
    fs.readFile(path.join(__dirname, `../../mockery/data/${dir}/${file}`));

type OutputArray = Record<string, unknown>[];

const getLogcatTestData = (dir: string): Promise<[Buffer, OutputArray]> =>
    Promise.all([
        readFile(dir, 'raw.log'),
        readFile(dir, 'output.json')
            .then(String)
            .then(JSON.parse)
            .then((output_) =>
                (output_ as OutputArray).map((entry) => ({
                    ...entry,
                    date: new Date(entry.date as string)
                }))
            )
    ]);

describe('Open logcat OKAY tests', () => {
    it('Should read all logs when logs buffer ends with a new line', async () => {
        const [data, output] = await getLogcatTestData('logsEndingWithNewLine');
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                // TODO test passes with incorrect command
                cmd: `shell:echo && logcat -B *:I 2>/dev/null`,
                res: { value: data, raw: true }
            }
        ]);
        try {
            const port = await adbMock.start();
            const adb = new Client({ noAutoStart: true, port });
            const result = await adb.openLogcatV2('serial');

            expect(result).toBeInstanceOf(LogcatReaderV2);
            const logsIterator = result.logs();
            let count = 0;
            for (const outputEntry of output) {
                count++;
                const entry = await logsIterator.next();
                expect(entry.value).toEqual(outputEntry);
            }
            const { done } = await logsIterator.next();
            expect(done).toBe(true);
            expect(count).toBe(output.length);
        } finally {
            await adbMock.end();
        }
    });
});
