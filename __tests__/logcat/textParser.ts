import { TextParserGrouped } from '../../lib/logcat';
import { readFile, readOutputFile } from '../../mockery/dataHelpers';

describe('TextParserGrouped tests', () => {
    let buffer: Buffer;
    let results: string[];
    beforeAll(async () => {
        const dir = 'logsWithMultiLineErrors';
        buffer = await readFile(dir, 'raw.log');
        results = await readOutputFile(dir);
    });
    it('should parse all logs', () => {
        const parser = new TextParserGrouped();
        const iterator = parser.parse(buffer);
        results.forEach((line) => {
            const { value } = iterator.next();
            expect(JSON.stringify(value)).toEqual(line);
        });
        const { done } = iterator.next();
        expect(done).toBe(true);
    });

    it('should parse logs coming in chunks', () => {
        const parser = new TextParserGrouped();
        const halfLength = Math.floor(buffer.length / 2);
        const firstChunk = buffer.subarray(0, halfLength);
        const secondChunk = buffer.subarray(halfLength);
        const resultsIterator = results.values();
        for (const currChunk of [firstChunk, secondChunk]) {
            for (const entry of parser.parse(currChunk)) {
                const { value } = resultsIterator.next();
                expect(JSON.stringify(entry)).toEqual(value);
            }
        }
        const { done } = resultsIterator.next();
        expect(done).toBe(true);
    });
});
