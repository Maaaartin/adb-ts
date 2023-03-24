import { Writable } from 'stream';
import { LogcatReader } from '../../lib/logcat/reader';
import { LogcatEntry } from '../../lib/logcat/entry';

describe('Logcat reader tests', () => {
    it('Should emit error when stream gets error event', (done) => {
        const reader = new LogcatReader();
        const stream = new Writable();
        reader.connect(stream);
        reader.on('error', (err) => {
            expect(err).toEqual(new Error('message'));
            done();
        });
        stream.emit('error', new Error('message'));
    });

    it('Should emit end when stream gets end event', (done) => {
        const reader = new LogcatReader();
        const stream = new Writable();
        reader.connect(stream);
        reader.on('end', () => {
            done();
        });
        stream.emit('end');
    });

    it('Should emit finish when stream gets finish event', (done) => {
        const reader = new LogcatReader();
        const stream = new Writable();
        reader.connect(stream);
        reader.on('finish', () => {
            done();
        });
        stream.emit('finish');
    });

    it('Should emit error when parser gets error event', (done) => {
        const reader = new LogcatReader();

        reader.connect(new Writable());
        reader.on('error', (err) => {
            expect(err).toEqual(new Error('message'));
            done();
        });
        reader['parser'].emit('error', new Error('message'));
    });

    it('Should emit entry when parser gets entry event', (done) => {
        const reader = new LogcatReader();

        reader.connect(new Writable());
        reader.on('entry', (err) => {
            expect(err).toEqual(
                ((): LogcatEntry => {
                    const entry = new LogcatEntry();
                    entry.date = new Date(2);
                    entry.pid = 10;
                    entry.tid = 10;
                    entry.priority = 5;
                    entry.tag = 'tag';
                    entry.message = 'message';
                    return entry;
                })()
            );
            done();
        });
        reader['parser'].emit(
            'entry',
            ((): LogcatEntry => {
                const entry = new LogcatEntry();
                entry.date = new Date(2);
                entry.pid = 10;
                entry.tid = 10;
                entry.priority = 5;
                entry.tag = 'tag';
                entry.message = 'message';
                return entry;
            })()
        );
    });

    it('Should emit entry with filter when parser gets entry event', (done) => {
        const reader = new LogcatReader();

        reader.connect(new Writable());
        reader['filter'] = (ent: LogcatEntry): boolean =>
            ent.message === 'message';
        reader.on('entry', (err) => {
            expect(err).toEqual(
                ((): LogcatEntry => {
                    const entry = new LogcatEntry();
                    entry.date = new Date(2);
                    entry.pid = 10;
                    entry.tid = 10;
                    entry.priority = 5;
                    entry.tag = 'tag';
                    entry.message = 'message';
                    return entry;
                })()
            );
            done();
        });
        reader['parser'].emit(
            'entry',
            ((): LogcatEntry => {
                const entry = new LogcatEntry();
                entry.date = new Date(2);
                entry.pid = 10;
                entry.tid = 10;
                entry.priority = 5;
                entry.tag = 'tag';
                entry.message = 'something';
                return entry;
            })()
        );
        reader['parser'].emit(
            'entry',
            ((): LogcatEntry => {
                const entry = new LogcatEntry();
                entry.date = new Date(2);
                entry.pid = 10;
                entry.tid = 10;
                entry.priority = 5;
                entry.tag = 'tag';
                entry.message = 'message';
                return entry;
            })()
        );
    });
});
