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
    param: T | ValueCallback<R> | Callback | undefined
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
    const exec = <T>(
        mapper: (match: string[], acc: T) => T
    ): ((init: T) => T) => {
        const execInternal: (acc: T) => T = (acc: T) => {
            const match = regExp.exec(value);
            return match ? execInternal(mapper(match.slice(1), acc)) : acc;
        };
        return execInternal;
    };

    switch (parseTo) {
        case 'list':
            return exec<string[]>(([match], acc) => acc.concat(match))([]);
        case 'map':
            return exec<PropertyMap>(([k, v], acc) =>
                acc.set(k, stringToType(v))
            )(new Map());
        default:
            return exec<string[][]>((match, acc) => [...acc, match])([]);
    }
}

export function buildFsParams<T extends object>(
    options: T | Callback | undefined,
    cb: Callback | undefined
): {
    options_: T | undefined;
    cb_: Callback | undefined;
} {
    if (typeof options === 'function') {
        return { options_: undefined, cb_: options };
    }
    if (typeof options === 'object') {
        return { options_: options, cb_: cb };
    }
    return { options_: undefined, cb_: cb };
}

// TODO remove cb
export function buildInputParams<T extends InputSource | InputOptions>(
    params: T | Callback | undefined,
    cb: Callback | undefined
): {
    params: T | undefined;
    cb_: Callback | undefined;
} {
    if (typeof params === 'function') {
        return { params: undefined, cb_: params };
    }
    if (typeof params !== 'undefined') {
        return { params, cb_: cb };
    }
    return { params: undefined, cb_: cb };
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
