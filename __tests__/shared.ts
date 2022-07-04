import {
    decodeLength,
    encodeLength,
    encodeData,
    stringToType,
    nodeify,
    parseCbParam,
    parseValueParam,
    parsePrimitiveParam,
    parseOptions
} from '../lib/index';

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
        const result = encodeData(Buffer.from(''));
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
        expect(result).toBe(null);
    });

    it('Cast undefined', () => {
        const result = stringToType('');
        expect(result).toBe(undefined);
    });

    it('Cast string', () => {
        const result = stringToType('test');
        expect(result).toBe('test');
    });

    it('Cast array as string', () => {
        const result = stringToType('[]');
        expect(result).toBe('[]');
    });
});

describe('Nodeify', () => {
    it('Resolve Promise', async () => {
        const result = await nodeify(Promise.resolve(null), undefined);
        expect(result).toBe(null);
    });

    it('Reject Promise', async () => {
        try {
            await nodeify(Promise.reject(new Error('message')), undefined);
        } catch (e) {
            expect(e.message).toBe('message');
        }
    });

    it('Resolve Callback', () => {
        const result = nodeify(Promise.resolve(null), (err, value) => {
            expect(err).toBe(null);
            expect(value).toBe(null);
        });
        expect(result).toBe(undefined);
    });

    it('Reject Callback', () => {
        const result = nodeify(
            Promise.reject(new Error('message')),
            (err, value) => {
                expect(err?.message).toBe('message');
                expect(value).toBe(undefined);
            }
        );
        expect(result).toBe(undefined);
    });
});

describe('Parse value param', () => {
    it('undefined', () => {
        const result = parseValueParam(undefined);
        expect(result).toBe(undefined);
    });

    it('function', () => {
        const result = parseValueParam(() => null);
        expect(result).toBe(undefined);
    });

    it('object', () => {
        const result = parseValueParam({ one: 1 });
        expect(result).toEqual({ one: 1 });
    });
});

describe('Parse cb params', () => {
    it('undefined/undefined', () => {
        const result = parseCbParam(undefined, undefined);
        expect(result).toBe(undefined);
    });

    it('function/undefined', () => {
        const result = parseCbParam(() => null, undefined);
        expect(typeof result).toBe('function');
    });

    it('object/undefined', () => {
        const result = parseCbParam({ one: 1 }, undefined);
        expect(result).toBe(undefined);
    });

    it('object/function', () => {
        const result = parseCbParam({ one: 1 }, () => null);
        expect(typeof result).toBe('function');
    });

    it('undefined/function', () => {
        const result = parseCbParam(undefined, () => null);
        expect(typeof result).toBe('function');
    });

    it('function/function', () => {
        const result = parseCbParam(
            () => 1,
            () => 2
        );
        expect(result?.(null, null)).toBe(1);
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

describe('Parse options', () => {
    it('undefined', () => {
        const result = parseOptions(undefined);
        expect(result).toBe(undefined);
    });

    it('function', () => {
        const result = parseOptions(() => null);
        expect(result).toBe(undefined);
    });

    it('object', () => {
        const result = parseOptions({ one: 1 });
        expect(result).toEqual({ one: 1 });
    });
});
