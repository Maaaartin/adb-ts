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
const readOutputFile = (dir: string): Promise<string[]> =>
    readFile(dir, 'output.json')
        .then(String)
        .then(JSON.parse)
        .then((output_) => output_.map((val: string) => JSON.stringify(val)));

describe('Open logcat OKAY tests', () => {
    const logDir = 'logsEndingWithNewLine';
    it('Should read all logs when logs buffer ends with a new line', async () => {
        const data = await readFile(logDir, 'raw.log');
        const adbMock = new AdbMock([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:echo && logcat --format=printable,year,UTC 2>/dev/null`,
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
            const output = await readOutputFile(logDir);
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
        const data = await readFile(logDir, 'raw.log');
        const halfLength = Math.floor(data.length / 2);
        const firstChunk = data.subarray(0, halfLength);
        const secondChunk = data.subarray(halfLength);

        const adbMock = new AdbMockMulti([
            { cmd: 'host:transport:serial', res: { raw: true } },
            {
                cmd: `shell:echo && logcat --format=printable,year,UTC 2>/dev/null`,
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
            const output = await readOutputFile(logDir);
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
