import { Client } from '../../lib/client';
import { AdbMock, AdbMockMulti } from '../../mockery/mockAdbServer';
import fs from 'fs/promises';
import path from 'path';
import { LogcatReaderV2 } from '../../lib/logcat';

const readFile = (
    dir: string,
    file: 'raw.log' | 'output.json'
): Promise<Buffer> =>
    fs.readFile(path.join(__dirname, `../../mockery/data/${dir}/${file}`));

const getLogcatTestData = (dir: string): Promise<[Buffer, string[]]> =>
    Promise.all([
        readFile(dir, 'raw.log'),
        readFile(dir, 'output.json')
            .then(String)
            .then(JSON.parse)
            .then((output_) =>
                output_.map((val: string) => JSON.stringify(val))
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
                expect(JSON.stringify(entry.value)).toEqual(outputEntry);
            }
            const { done } = await logsIterator.next();
            expect(done).toBe(true);
            expect(count).toBe(output.length);
        } finally {
            await adbMock.end();
        }
    });

    it('Should read all logs from incoming data', async () => {
        const [data, output] = await getLogcatTestData('logsEndingWithNewLine');
        const halfLength = Math.floor(data.length / 2);
        const firstChunk = data.subarray(0, halfLength);
        const secondChunk = data.subarray(halfLength);

        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                // TODO test passes with incorrect command
                cmd: `shell:echo && logcat -B *:I 2>/dev/null`,
                res: { value: firstChunk, raw: true },
                end: true,
                writeAsync: { data: secondChunk, delay: 500 }
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
                expect(JSON.stringify(entry.value)).toEqual(outputEntry);
            }
            const { done } = await logsIterator.next();
            expect(done).toBe(true);
            expect(count).toBe(output.length);
        } finally {
            await adbMock.end();
        }
    });
});
