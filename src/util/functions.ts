import { PropertyMap, PropertyValue, PrimitiveType } from './types';

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

export const stringToType = (value: string): PropertyValue => {
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
