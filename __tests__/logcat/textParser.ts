import { TextParserGrouped } from '../../lib/logcat';
import { readFile, readOutputFile } from '../../mockery/dataHelpers';

describe('TextParserGrouped tests', () => {
    it('should parse all logs', async () => {
        const dir = 'logsWithMultiLineErrors';
        const parser = new TextParserGrouped();
        const buffer = await readFile(dir, 'raw.log');
        const results = await readOutputFile(dir);
        const iterator = parser.parse(buffer);
        results.forEach((line) => {
            const { value } = iterator.next();
            expect(JSON.stringify(value)).toEqual(line);
        });
        const { done } = iterator.next();
        expect(done).toBe(true);
    });

    it('should parse logs coming in chunks', async () => {
        const dir = 'logsWithMultiLineErrors';
        const parser = new TextParserGrouped();
        const buffer = await readFile(dir, 'raw.log');
        const halfLength = Math.floor(buffer.length / 2);
        const firstChunk = buffer.subarray(0, halfLength);

        const results = await readOutputFile(dir);
        const resultsIterator = results.values();
        for (const entry of parser.parse(firstChunk)) {
            const { value } = resultsIterator.next();
            expect(JSON.stringify(entry)).toEqual(value);
        }
        const secondChunk = buffer.subarray(halfLength);
        for (const entry of parser.parse(secondChunk)) {
            const { value } = resultsIterator.next();
            expect(JSON.stringify(entry)).toEqual(value);
        }
        const { done } = resultsIterator.next();
        expect(done).toBe(true);
    });
});
