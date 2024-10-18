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
});
