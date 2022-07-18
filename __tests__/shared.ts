import {
    decodeLength,
    encodeLength,
    encodeData,
    stringToType,
    nodeify,
    parseCbParam,
    parseValueParam,
    parsePrimitiveParam,
    parseOptions,
    findMatches,
    PrimitiveWithDate
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
        expect(result).toBe(void 0);
    });

    it('Cast string', () => {
        const result = stringToType('test');
        expect(result).toBe('test');
    });

    it('Cast array as string', () => {
        const result = stringToType('[]');
        expect(result).toBe('[]');
    });

    it('Cast string date as Date', () => {
        const result = stringToType('Mon Dec 20 15:05:47 UTC 2021');
        expect(result).toEqual(new Date('Mon Dec 20 15:05:47 UTC 2021'));
    });
});

describe('Nodeify', () => {
    it('Resolve Promise', async () => {
        const result = await nodeify(Promise.resolve(null), void 0);
        expect(result).toBe(null);
    });

    it('Reject Promise', async () => {
        try {
            await nodeify(Promise.reject(new Error('message')), void 0);
        } catch (e) {
            expect(e.message).toBe('message');
        }
    });

    it('Resolve Callback', () => {
        const result = nodeify(Promise.resolve(null), (err, value) => {
            expect(err).toBe(null);
            expect(value).toBe(null);
        });
        expect(result).toBe(void 0);
    });

    it('Reject Callback', () => {
        const result = nodeify(
            Promise.reject(new Error('message')),
            (err, value) => {
                expect(err?.message).toBe('message');
                expect(value).toBe(void 0);
            }
        );
        expect(result).toBe(void 0);
    });
});

describe('Parse value param', () => {
    it('undefined', () => {
        const result = parseValueParam(void 0);
        expect(result).toBe(void 0);
    });

    it('function', () => {
        const result = parseValueParam(() => null);
        expect(result).toBe(void 0);
    });

    it('object', () => {
        const result = parseValueParam({ one: 1 });
        expect(result).toEqual({ one: 1 });
    });
});

describe('Parse cb params', () => {
    it('undefined/undefined', () => {
        const result = parseCbParam(void 0, void 0);
        expect(result).toBe(void 0);
    });

    it('function/undefined', () => {
        const result = parseCbParam(() => null, void 0);
        expect(typeof result).toBe('function');
    });

    it('object/undefined', () => {
        const result = parseCbParam({ one: 1 }, void 0);
        expect(result).toBe(void 0);
    });

    it('object/function', () => {
        const result = parseCbParam({ one: 1 }, () => null);
        expect(typeof result).toBe('function');
    });

    it('undefined/function', () => {
        const result = parseCbParam(void 0, () => null);
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
        const result = parsePrimitiveParam(1, void 0);
        expect(result).toBe(1);
    });

    it('non undefined', () => {
        const result = parsePrimitiveParam(1, 2);
        expect(result).toBe(2);
    });
});

describe('Parse options', () => {
    it('undefined', () => {
        const result = parseOptions(void 0);
        expect(result).toBe(void 0);
    });

    it('function', () => {
        const result = parseOptions(() => null);
        expect(result).toBe(void 0);
    });

    it('object', () => {
        const result = parseOptions({ one: 1 });
        expect(result).toEqual({ one: 1 });
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
[seven]: [Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)]
[eight]: []`,
            /^\[([\s\S]*?)\]: \[([\s\S]*?)\]?$/gm
        );
        expect(result).toEqual([
            ['one', '1'],
            ['two', 'two'],
            ['three', 'false'],
            ['four', 'true'],
            ['five', 'null'],
            ['six', '[]'],
            [
                'seven',
                'Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)'
            ],
            ['eight', '']
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
[seven]: [Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)]
[eight]: []`,
            /^\[([\s\S]*?)\]: \[([\s\S]*?)\]?$/gm,
            true
        );
        expect(result).toEqual(
            new Map<string, PrimitiveWithDate>([
                ['one', 1],
                ['two', 'two'],
                ['three', false],
                ['four', true],
                ['five', null],
                ['six', '[]'],
                [
                    'seven',
                    new Date(
                        'Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)'
                    )
                ],
                ['eight', void 0]
            ])
        );
    });
});
