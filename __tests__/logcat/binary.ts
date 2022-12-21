import Binary from '../../lib/logcat/parser/binary';
import LogcatEntry from '../../lib/logcat/entry';

const logCatRes = Buffer.from([
    66, 0, 28, 0, 212, 0, 0, 0, 212, 0, 0, 0, 32, 109, 160, 99, 108, 188, 242,
    47, 0, 0, 0, 0, 45, 4, 0, 0, 4, 108, 111, 119, 109, 101, 109, 111, 114, 121,
    107, 105, 108, 108, 101, 114, 0, 85, 115, 105, 110, 103, 32, 112, 115, 105,
    32, 109, 111, 110, 105, 116, 111, 114, 115, 32, 102, 111, 114, 32, 109, 101,
    109, 111, 114, 121, 32, 112, 114, 101, 115, 115, 117, 114, 101, 32, 100,
    101, 116, 101, 99, 116, 105, 111, 110, 0, 46, 0, 28, 0, 212, 0, 0, 0, 212,
    0, 0, 0, 32, 109, 160, 99, 204, 6, 47, 48, 0, 0, 0, 0, 45, 4, 0, 0, 4, 108,
    111, 119, 109, 101, 109, 111, 114, 121, 107, 105, 108, 108, 101, 114, 0, 80,
    114, 111, 99, 101, 115, 115, 32, 112, 111, 108, 108, 105, 110, 103, 32, 105,
    115, 32, 115, 117, 112, 112, 111, 114, 116, 101, 100, 0, 72, 0, 28, 0, 211,
    0, 0, 0, 211, 0, 0, 0, 24, 109, 160, 99, 0, 159, 142, 24, 0, 0, 0, 0, 12, 4,
    0, 0, 5, 97, 117, 100
]);
const entry1 = new LogcatEntry();
entry1.date = new Date('2022-12-19T13:54:40.804Z');
entry1.message = 'Using psi monitors for memory pressure detection';
entry1.pid = 212;
entry1.priority = 4;
entry1.tag = 'lowmemorykiller';
entry1.tid = 212;

const entry2 = new LogcatEntry();
entry2.date = new Date('2022-12-19T13:54:40.808Z');
entry2.message = 'Process polling is supported';
entry2.pid = 212;
entry2.priority = 4;
entry2.tag = 'lowmemorykiller';
entry2.tid = 212;

describe('Binary parser tests', () => {
    it('Should emit entries', (done) => {
        const parser = new Binary();
        const entryPool = [entry1, entry2];
        parser.on('entry', (entry) => {
            expect(entry).toEqual(entryPool.shift());
            if (entryPool.length === 0) {
                done();
            }
        });

        parser.parse(logCatRes);
    });

    it('Should emit wait', (done) => {
        const parser = new Binary();
        parser.on('wait', () => {
            done();
        });
        parser.parse(logCatRes);
    });

    it('Should emit drain', (done) => {
        const parser = new Binary();
        parser.on('drain', () => {
            done();
        });
        parser.parse(Buffer.from([]));
    });

    it('Should emit error', (done) => {
        const parser = new Binary();
        parser.on('error', (err) => {
            expect(err).toEqual(
                new Error(
                    `Unprocessable entry data '${Buffer.from(
                        new Array(257).fill(1)
                    )}'`
                )
            );
            done();
        });

        parser.parse(Buffer.from([...new Array(300).fill(1)]));
    });
});
