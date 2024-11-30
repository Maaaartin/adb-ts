import { EventEmitter } from 'events';
import {
    decodeLength,
    encodeLength,
    encodeData,
    stringToType,
    parsePrimitiveParam,
    findMatches,
    PropertyValue,
    escape,
    escapeCompat,
    autoUnregister
} from '../lib/util';

describe('Encode/decode length', () => {
    it('Decode length', () => {
        const result = decodeLength('20');
        expect(result).toBe(32);
    });

    it('Encode length', () => {
        const result = encodeLength(20);
        expect(result).toBe('0014');
    });
});

describe('Encode data', () => {
    it('Encode empty Buffer', () => {
        const result = encodeData(Buffer.alloc(0));
        expect(result).toEqual(Buffer.from('0000'));
    });

    it('Encode non empty Buffer', () => {
        const result = encodeData(Buffer.from('1234'));
        expect(result).toEqual(Buffer.from('00041234'));
    });

    it('Encode empty string', () => {
        const result = encodeData('');
        expect(result).toEqual(Buffer.from('0000'));
    });

    it('Encode non empty string', () => {
        const result = encodeData('1234');
        expect(result).toEqual(Buffer.from('00041234'));
    });
});

describe('String to type', () => {
    it('Cast number', () => {
        const result = stringToType('1');
        expect(result).toBe(1);
    });

    it('Cast true', () => {
        const result = stringToType('true');
        expect(result).toBe(true);
    });

    it('Cast false', () => {
        const result = stringToType('false');
        expect(result).toBe(false);
    });

    it('Cast null', () => {
        const result = stringToType('null');
        expect(result).toBeNull();
    });

    it('Cast undefined', () => {
        const result = stringToType('');
        expect(result).toBeUndefined();
    });

    it('Cast string', () => {
        const result = stringToType('test');
        expect(result).toBe('test');
    });

    it('Cast single quotation marks', () => {
        const result = stringToType("'test'");
        expect(result).toBe("'test'");
    });

    it('Cast double quotation marks', () => {
        const result = stringToType('"test"');
        expect(result).toBe('"test"');
    });

    it('Cast array as string', () => {
        const result = stringToType('[]');
        expect(result).toBe('[]');
    });
});

describe('Parse primitive type', () => {
    it('undefined', () => {
        const result = parsePrimitiveParam(1, undefined);
        expect(result).toBe(1);
    });

    it('non undefined', () => {
        const result = parsePrimitiveParam(1, 2);
        expect(result).toBe(2);
    });
});

describe('Find matches', () => {
    it('Return array', () => {
        const result = findMatches(
            `[one]: [1]
[two]: [two]
[three]: [false]
[four]: [true]
[five]: [null]
[six]: [[]]
[seven]: []`,
            /^\[([\s\S]*?)\]: \[([\s\S]*?)\]?$/gm
        );
        expect(result).toEqual([
            ['one', '1'],
            ['two', 'two'],
            ['three', 'false'],
            ['four', 'true'],
            ['five', 'null'],
            ['six', '[]'],
            ['seven', '']
        ]);
    });

    it('Return map', () => {
        const result = findMatches(
            `[one]: [1]
[two]: [two]
[three]: [false]
[four]: [true]
[five]: [null]
[six]: [[]]
[seven]: []`,
            /^\[([\s\S]*?)\]: \[([\s\S]*?)\]?$/gm,
            'map'
        );
        expect(result).toEqual(
            new Map<string, PropertyValue>([
                ['one', 1],
                ['two', 'two'],
                ['three', false],
                ['four', true],
                ['five', null],
                ['six', '[]'],
                ['seven', undefined]
            ])
        );
    });

    it('Return list', () => {
        const result = findMatches(
            `[one]: [1]
[two]: [two]
[three]: [false]
[four]: [true]
[five]: [null]
[six]: [[]]
[seven]: []`,
            /^\[([\s\S]*?)\]: \[([\s\S]*?)\]?$/gm,
            'list'
        );
        expect(result).toEqual([
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
            'seven'
        ]);
    });
});

describe('Escape tests', () => {
    it('escape undefined', () => {
        const result = escape(undefined);
        expect(result).toBe("''");
    });
    it('escape string', () => {
        const result = escape("'test'");
        expect(result).toBe(`''"'"'test'"'"''`);
    });
    it('escape number', () => {
        const result = escape(1);
        expect(result).toBe(`${1}`);
    });
    it('escape null', () => {
        const result = escape(null);
        expect(result).toBe(`${null}`);
    });
    it('escape bool', () => {
        const result = escape(true);
        expect(result).toBe(`${true}`);
    });
});

describe('Escape compat tests', () => {
    it('escape undefined', () => {
        const result = escapeCompat(undefined);
        expect(result).toBe("''");
    });
    it('escape string', () => {
        const result = escapeCompat('"test"');
        expect(result).toBe('"\\"test\\""');
    });
    it('escape number', () => {
        const result = escapeCompat(1);
        expect(result).toBe(`${1}`);
    });
    it('escape null', () => {
        const result = escapeCompat(null);
        expect(result).toBe(`${null}`);
    });
    it('escape bool', () => {
        const result = escapeCompat(true);
        expect(result).toBe(`${true}`);
    });
});

describe('Auto unregister', () => {
    it('Unregister after success', async () => {
        const emitter = new EventEmitter();
        const listener1 = jest.fn();
        emitter.on('test', listener1);
        await autoUnregister(emitter, async (emitter) => {
            const listener2 = jest.fn();
            emitter.on('test', listener2);
        });
        const listeners = emitter
            .eventNames()
            .flatMap((event) => emitter.listeners(event));
        expect(listeners).toEqual([listener1]);
    });

    it('Unregister after error', async () => {
        const emitter = new EventEmitter();
        const listener1 = jest.fn();
        emitter.on('test', listener1);
        try {
            await autoUnregister(emitter, async (emitter) => {
                const listener2 = jest.fn();
                emitter.on('test', listener2);
                throw new Error('Test');
            });
        } catch {
            /* empty */
        } finally {
            const listeners = emitter
                .eventNames()
                .flatMap((event) => emitter.listeners(event));
            expect(listeners).toEqual([listener1]);
        }
    });
});
