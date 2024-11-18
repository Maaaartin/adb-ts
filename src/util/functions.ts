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
        if(isValidDate(value)) {
            return new Date(value);
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


export function isValidDate(dateString: string): boolean {
    // Basic date format regular expressions
    const dateRegex = {
        // ISO date: 2024-03-21, 2024-03-21T10:30:00.000Z
        iso: /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z?)?$/,
        // US date format: MM/DD/YYYY
        us: /^\d{1,2}\/\d{1,2}\/\d{4}$/,
        // European date format: DD.MM.YYYY or DD-MM-YYYY
        eu: /^(\d{1,2})[.-]\d{1,2}[.-]\d{4}$/,
         // Unix 时间戳 (秒或毫秒)
        timestamp: /^\d{10,13}$/
    };

    // Check if string matches any date format
    const isDateFormat = Object.values(dateRegex).some(regex => regex.test(dateString));
    if (!isDateFormat) return false;

     // For timestamp format, first convert to number
     if (dateRegex.timestamp.test(dateString)) {
        const timestamp = parseInt(dateString);
        // If timestamp is in seconds, convert to milliseconds
        const milliseconds = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
        return !isNaN(new Date(milliseconds).getTime());
    }


    // Create and validate date object
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return false;
    return true;
}
