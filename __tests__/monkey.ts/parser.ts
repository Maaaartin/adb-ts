import Parser from '../../lib/monkey/parser';
import { ErrReply, OkReply } from '../../lib/monkey/reply';

describe('Monkey Parser tests', () => {
    it('Should parse OK without value', (done) => {
        const parser = new Parser();
        parser.on('reply', (reply) => {
            expect(reply).toEqual(new OkReply(null));
            done();
        });
        parser.parse(Buffer.from('OK\n'));
    });

    it('Should parse OK with value', (done) => {
        const parser = new Parser();
        parser.on('reply', (reply) => {
            expect(reply).toEqual(new OkReply('value'));
            done();
        });
        parser.parse(Buffer.from('OK value\n'));
    });

    it('Should parse multiple lines', (done) => {
        const parser = new Parser();
        const replies = ['value1', 'value2'];
        parser.on('reply', (reply) => {
            const val = replies.shift();
            if (!val) {
                fail('Unexpected reply');
            }
            expect(reply).toEqual(new OkReply(val));

            if (replies.length === 0) {
                done();
            }
        });
        parser.parse(Buffer.from('OK value1\nOK value2\n'));
    });

    it('Should parse multiple replies', (done) => {
        const parser = new Parser();
        const replies = ['value1', 'value2'];
        parser.on('reply', (reply) => {
            const val = replies.shift();
            if (!val) {
                fail('Unexpected reply');
            }
            expect(reply).toEqual(new OkReply(val));

            if (replies.length === 0) {
                done();
            }
        });
        parser.parse(Buffer.from('OK value1\n'));
        parser.parse(Buffer.from('OK value2\n'));
    });

    it('Should parse multiple replies and lines', (done) => {
        const parser = new Parser();
        const replies = ['value1', 'value2', 'value3', 'value4'];
        parser.on('reply', (reply) => {
            const val = replies.shift();
            if (!val) {
                fail('Unexpected reply');
            }
            expect(reply).toEqual(new OkReply(val));

            if (replies.length === 0) {
                done();
            }
        });
        parser.parse(Buffer.from('OK value1\nOK value2\n'));
        parser.parse(Buffer.from('OK value3\nOK value4\n'));
    });

    it('Should parse ERROR without value', (done) => {
        const parser = new Parser();
        parser.on('reply', (reply) => {
            expect(reply).toEqual(new ErrReply(null));
            done();
        });
        parser.parse(Buffer.from('ERROR\n'));
    });

    it('Should parse ERROR with value', (done) => {
        const parser = new Parser();
        parser.on('reply', (reply) => {
            expect(reply).toEqual(new ErrReply('value'));
            done();
        });
        parser.parse(Buffer.from('ERROR value\n'));
    });

    it('Should throw Syntax error', (done) => {
        const parser = new Parser();
        parser.on('error', (err) => {
            expect(err).toEqual(new SyntaxError("Unparsable line 'FAIL'"));
            done();
        });
        parser.parse(Buffer.from('FAIL\n'));
    });
});
