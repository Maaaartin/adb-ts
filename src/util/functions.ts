import { callbackify } from 'util';
import {
    Callback,
    ValueCallback,
    InputOptions,
    InputSource,
    PropertyMap,
    PropertyValue,
    NonFunctionProperties,
    PrimitiveType
} from './types';

export const decodeLength = (length: string): number => {
    return parseInt(length, 16);
};

export const encodeLength = (length: number): string => {
    return ('0000' + length.toString(16)).slice(-4).toUpperCase();
};

export const encodeData = (data: Buffer | string): Buffer => {
    return Buffer.concat([
        Buffer.from(encodeLength(data.length)),
        Buffer.from(data)
    ]);
};

export const stringToType = (value = ''): PropertyValue => {
    try {
        const parsed = JSON.parse(value);
        if (
            typeof parsed === 'string' ||
            (typeof parsed === 'object' && parsed !== null)
        ) {
            return value;
        }
        return parsed;
    } catch {
        const date = new Date(value);
        if (!isNaN(date.getMilliseconds())) {
            return date;
        }
        return value || undefined;
    }
};

export const nodeify: <T>(
    promise: Promise<T>,
    cb: ((err: null | Error, value: T) => void) | undefined
) => Promise<T> | void = (promise, cb) => {
    return cb ? callbackify(() => promise)(cb) : promise;
};

export const parseValueParam = <T extends NonFunctionProperties<T> | string, R>(
    param: T | ValueCallback<R> | undefined
): T | undefined => {
    if (typeof param === 'function') {
        return;
    }
    return param;
};

export const parseCbParam = <T extends NonFunctionProperties<T> | string, R>(
    param: T | ValueCallback<R> | undefined,
    cb: ValueCallback<R> | undefined
): ValueCallback<R> | undefined => {
    if (typeof param === 'function') {
        return param;
    }
    return cb;
};

export const parsePrimitiveParam = <T>(def: T, param: T | undefined): T => {
    if (typeof param === 'undefined') {
        return def;
    }
    return param;
};
export const parseOptions = <R extends Record<string, any>>(
    options: R | undefined
): NonFunctionProperties<R> | undefined => {
    if (typeof options === 'function') {
        return;
    }
    return options;
};

export function findMatches(
    value: string,
    regExp: RegExp,
    parseTo: 'list'
): string[];
export function findMatches(
    value: string,
    regExp: RegExp,
    parseTo: 'map'
): PropertyMap;
export function findMatches(value: string, regExp: RegExp): string[][];
export function findMatches(
    value: string,
    regExp: RegExp,
    parseTo?: 'list' | 'map'
): PropertyMap | string[][] | string[] {
    let match: RegExpExecArray | null = null;
    const acc: string[][] = [];
    while ((match = regExp.exec(value))) {
        acc.push(match.slice(1));
    }
    switch (parseTo) {
        case 'list':
            return acc.map(([val]) => val);
        case 'map':
            return new Map(acc.map(([k, v]) => [k, stringToType(v)]));
        default:
            return acc;
    }
}

export function buildInputParams(
    defaultSource: InputSource,
    source: InputOptions | InputSource | Callback | undefined,
    cb: Callback | undefined
): {
    source: InputSource;
    cb: Callback | undefined;
} {
    if (typeof source === 'function') {
        return { source: defaultSource, cb: source };
    }
    if (typeof source === 'undefined') {
        return { source: defaultSource, cb };
    }
    if (typeof source !== 'object') {
        return { source, cb };
    }
    if (typeof source.source !== 'undefined') {
        return { source: source.source, cb };
    }
    return { source: defaultSource, cb };
}

export function escape(arg: PrimitiveType): string {
    switch (typeof arg) {
        case 'undefined':
            return "''";
        case 'string':
            return "'" + arg.replace(/'/g, "'\"'\"'") + "'";
        default:
            return `${arg}`;
    }
}

export function escapeCompat(arg: PrimitiveType): string {
    switch (typeof arg) {
        case 'string':
            return '"' + arg.replace(/([$`\\!"])/g, '\\$1') + '"';
        default:
            return escape(arg);
    }
}
