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
    buildInputParams,
    PropertyValue,
    escape,
    escapeCompat
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

    it('Cast string date as Date', () => {
        const result = stringToType('Mon Dec 20 15:05:47 UTC 2021');
        expect(result).toEqual(new Date('Mon Dec 20 15:05:47 UTC 2021'));
    });

    it('Cast iso date as Date', () => {
        const date = new Date();
        const result = stringToType(date.toISOString());
        expect(result).toEqual(date);
    });
});

describe('Nodeify', () => {
    it('Resolve Promise', async () => {
        const result = await nodeify(Promise.resolve(null), undefined);
        expect(result).toBeNull();
    });

    it('Reject Promise', async () => {
        try {
            await nodeify(Promise.reject(new Error('message')), undefined);
        } catch (e: any) {
            expect(e.message).toBe('message');
        }
    });

    it('Resolve Callback', () => {
        const result = nodeify(Promise.resolve(null), (err, value) => {
            expect(err).toBeNull();
            expect(value).toBeNull();
        });
        expect(result).toBeUndefined();
    });

    it('Reject Callback', () => {
        const result = nodeify(
            Promise.reject(new Error('message')),
            (err, value) => {
                expect(err?.message).toBe('message');
                expect(value).toBeUndefined();
            }
        );
        expect(result).toBeUndefined();
    });
});

describe('Parse value param', () => {
    it('undefined', () => {
        const result = parseValueParam(undefined);
        expect(result).toBeUndefined();
    });

    it('function', () => {
        const result = parseValueParam(() => null);
        expect(result).toBeUndefined();
    });

    it('object', () => {
        const result = parseValueParam({ one: 1 });
        expect(result).toEqual({ one: 1 });
    });
});

describe('Parse cb params', () => {
    it('undefined/undefined', () => {
        const result = parseCbParam(undefined, undefined);
        expect(result).toBeUndefined();
    });

    it('function/undefined', () => {
        const result = parseCbParam(() => null, undefined);
        expect(typeof result).toBe('function');
    });

    it('object/undefined', () => {
        const result = parseCbParam({ one: 1 }, undefined);
        expect(result).toBeUndefined();
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
        expect(result).toBeUndefined();
    });

    it('function', () => {
        const result = parseOptions(() => null);
        expect(result).toBeUndefined();
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
                [
                    'seven',
                    new Date(
                        'Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)'
                    )
                ],
                ['eight', undefined]
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
[seven]: [Sun Jul 17 2022 21:11:48 GMT+0200 (Central European Summer Time)]
[eight]: []`,
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
            'seven',
            'eight'
        ]);
    });
});

describe('Build input params', () => {
    it('Source is input options, cb is undefined', () => {
        const result = buildInputParams(
            'gamepad',
            { source: 'keyboard' },
            undefined
        );
        expect(Object.entries(result)).toEqual([
            ['source', 'keyboard'],
            ['cb', undefined]
        ]);
    });

    it('Source is input source, cb is undefined', () => {
        const { source, cb } = buildInputParams(
            'gamepad',
            'keyboard',
            undefined
        );
        expect(source).toBe('keyboard');
        expect(cb?.toString()).toBeUndefined();
    });

    it('Source is function, cb is undefined', () => {
        const { source, cb } = buildInputParams('gamepad', () => {}, undefined);
        expect(source).toBe('gamepad');
        expect(cb?.toString()).toBe((() => {}).toString());
    });

    it('Source is undefined, cb is undefined', () => {
        const { source, cb } = buildInputParams(
            'gamepad',
            undefined,
            undefined
        );
        expect(source).toBe('gamepad');
        expect(cb?.toString()).toBeUndefined();
    });

    it('Source is input options, cb is function', () => {
        const { source, cb } = buildInputParams(
            'gamepad',
            { source: 'keyboard' },
            () => {}
        );
        expect(source).toBe('keyboard');
        expect(cb?.toString()).toBe((() => {}).toString());
    });

    it('Source is input source, cb is function', () => {
        const { source, cb } = buildInputParams(
            'gamepad',
            'keyboard',
            () => {}
        );
        expect(source).toBe('keyboard');
        expect(cb?.toString()).toBe((() => {}).toString());
    });

    it('Source is function, cb is function', () => {
        const { source, cb } = buildInputParams(
            'gamepad',
            () => 0,
            () => 1
        );
        expect(source).toBe('gamepad');
        expect(cb?.toString()).toBe((() => 0).toString());
    });

    it('Source is undefined, cb is function', () => {
        const { source, cb } = buildInputParams('gamepad', undefined, () => {});
        expect(source).toBe('gamepad');
        expect(cb?.toString()).toBe((() => {}).toString());
    });

    it('Source is empty object', () => {
        const { source, cb } = buildInputParams('gamepad', {}, undefined);
        expect(source).toBe('gamepad');
        expect(cb?.toString()).toBeUndefined();
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
