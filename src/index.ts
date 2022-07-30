import Command from './command';
import Connection from './connection';
import LogcatEntry from './logcat/entry';
import { callbackify } from 'util';
import IpConnect from './commands/ipConnect';

export enum Priority {
    DEFAULT = 1,
    VERBOSE = 2,
    DEBUG = 3,
    INFO = 4,
    WARN = 5,
    ERROR = 6,
    FATAL = 7,
    SILENT = 8
}

export enum Reply {
    OKAY = 'OKAY',
    FAIL = 'FAIL',
    STAT = 'STAT',
    LIST = 'LIST',
    DENT = 'DENT',
    RECV = 'RECV',
    DATA = 'DATA',
    DONE = 'DONE',
    SEND = 'SEND',
    QUIT = 'QUIT'
}

export const ADB_DEFAULT_PORT = 5555;

export const decodeLength = (length: string): number => {
    return parseInt(length, 16);
};

export const encodeLength = (length: number): string => {
    return ('0000' + length.toString(16)).slice(-4).toUpperCase();
};

export const encodeData = (data: Buffer | string): Buffer => {
    if (!Buffer.isBuffer(data)) {
        data = Buffer.from(data);
    }
    return Buffer.concat([Buffer.from(encodeLength(data.length)), data]);
};

export const stringToType = (value = ''): PrimitiveWithDate => {
    switch (value) {
        case '':
            return void 0;
        case 'true':
            return true;
        case 'false':
            return false;
        case 'null':
            return null;
        default: {
            const num = Number(value);
            if (!isNaN(num)) {
                return num;
            }
            const date = new Date(value);
            if (!isNaN(date.getMilliseconds())) {
                return date;
            }
            return `${value}`;
        }
    }
};

export const nodeify: <T>(
    promise: Promise<T>,
    cb: ((err: null | Error, value: T) => void) | undefined
) => Promise<T> | void = (promise, cb) => {
    return cb ? callbackify(() => promise)(cb) : promise;
};

type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export const parseValueParam = <T extends NonFunctionProperties<T> | string, R>(
    param: T | ExecCallbackWithValue<R> | undefined
): T | undefined => {
    if (typeof param === 'function') {
        return;
    }
    return param;
};

export const parseCbParam = <T extends NonFunctionProperties<T> | string, R>(
    param: T | ExecCallbackWithValue<R> | undefined,
    cb: ExecCallbackWithValue<R> | undefined
): ExecCallbackWithValue<R> | undefined => {
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
    parseTo: 'set'
): Set<string>;
export function findMatches(
    value: string,
    regExp: RegExp,
    parseTo: 'map'
): DataMap;
export function findMatches(value: string, regExp: RegExp): string[][];
export function findMatches(
    value: string,
    regExp: RegExp,
    parseTo?: 'set' | 'map'
): DataMap | string[][] | Set<string> {
    let match: RegExpExecArray | null = null;
    const acc: string[][] = [];
    while ((match = regExp.exec(value))) {
        acc.push(match.slice(1));
    }
    switch (parseTo) {
        case 'set':
            return new Set(acc.map(([val]) => val));
        case 'map':
            return new DataMap(acc.map(([k, v]) => [k, stringToType(v)]));
        default:
            return acc;
    }
}

export function buildInputParams(
    defaultSource: InputSource,
    source: InputOptions | InputSource | ExecCallback | undefined,
    cb: ExecCallback | undefined
): { source: InputSource; cb: ExecCallback | undefined } {
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

export type ExecCallback = (err: null | Error) => void;
export type ExecCallbackWithValue<T> = (err: null | Error, value: T) => void;

export type ExecValue<T = void> = Promise<T> | void;

export type DeviceState =
    | 'offline'
    | 'device'
    | 'emulator'
    | 'unauthorized'
    | 'recovery'
    | 'no permissions';

export type AdbFlag =
    | '-f'
    | '-d'
    | '-e'
    | '-g'
    | '-k'
    | '-s'
    | '-t'
    | '-3'
    | '-i'
    | '-u';

export type AdbExtraType =
    | 'string'
    | 'null'
    | 'bool'
    | 'int'
    | 'long'
    | 'float'
    | 'uri'
    | 'component';

export type AdbExtra = {
    key: string;
    type: AdbExtraType;
    value: PrimitiveType | PrimitiveType[];
};

export type NonEmptyArray<T> = [T, ...T[]];

export interface StartServiceOptions {
    user?: number | string;
    action?: string;
    data?: string;
    mimeType?: string;
    category?: string | string[];
    flags?: AdbFlag | AdbFlag[];
    extras?: AdbExtra | AdbExtra[];
}

export interface StartActivityOptions extends StartServiceOptions {
    debug?: boolean;
    wait?: boolean;
}

export interface IAdbDevice {
    id: string;
    state: DeviceState;
    path?: string;
    device?: string;
    model?: string;
    product?: string;
    transportId: string;
    transport: TransportType;
}

export type StatsObject = {
    bytesTransferred: number;
};

export interface ReversesForwardsBase {
    local: string;
    remote: string;
}
export interface ReversesObject extends ReversesForwardsBase {
    host: string;
}

export interface ForwardsObject extends ReversesForwardsBase {
    serial: string;
}

export type PrimitiveType = string | boolean | number | null | undefined;

export type PrimitiveWithDate = PrimitiveType | Date;

export type PrimitiveDictionary = Record<string, PrimitiveWithDate>;

export interface InstallOptions {
    reinstall?: boolean;
    test?: boolean;
    internal?: boolean;
    allowDowngrade?: boolean;
    grandPermissions?: boolean;
    [key: string]: any;
}

export interface UninstallOptions {
    keepCache?: boolean;
}
export type AdbClientOptionsValues = {
    port: number;
    bin: string;
    host: string;
    noAutoStart: boolean;
};

export type AdbClientOptions = {
    [K in keyof AdbClientOptionsValues]?: AdbClientOptionsValues[K];
};

export interface LogcatOptions {
    clear?: boolean;
    filter?: (entry: LogcatEntry) => boolean;
}

export interface LogcatReaderOptions {
    fixLineFeeds?: boolean;
    filter?: (entry: LogcatEntry) => boolean;
}

export type TransportType = 'usb' | 'local'; // | 'any' - impossible state

export type WaitForState = 'device' | 'recovery' | 'sideload' | 'bootloader';

export type SettingsMode = 'system' | 'global' | 'secure';

export type InputSource =
    | 'dpad'
    | 'keyboard'
    | 'mouse'
    | 'touchpad'
    | 'gamepad'
    | 'touchnavigation'
    | 'joystick'
    | 'touchscreen'
    | 'stylus'
    | 'trackball';

export type InputType =
    | 'text'
    | 'keyevent'
    | 'tap'
    | 'swipe'
    | 'draganddrop'
    | 'press'
    | 'roll';

export interface InputOptions {
    source?: InputSource;
}

export interface CommandConstruct {
    new (connection: Connection): Command;
}

export interface IpConnectConstruct {
    new (connection: Connection): IpConnect;
}

export interface IPreExecute<T> {
    preExecute: (...args: any[]) => Promise<T>;
}

export interface IPostExecute<T> {
    preExecute: (...args: any[]) => Promise<T>;
}

export interface ICmd {
    readonly Cmd: string;
}

export type MonkeyCallback<T = string> = (
    err: Error | null,
    value: T | null,
    command?: string
) => void;

type ForceFSOption = { force?: boolean };
type InteractiveFSOption = { interactive?: boolean };
type NoClobberFSOption = { noClobber?: boolean };
type VerboseFSoption = { verbose?: boolean };
type SymlinkFSoption = { symlink?: boolean };
type RecursiveFSOption = { recursive?: boolean };

export type RmOption = ForceFSOption & InteractiveFSOption & RecursiveFSOption;

export type MkDirOptions = VerboseFSoption &
    InputOptions &
    ForceFSOption & {
        mode?: number;
        parent?: boolean;
    };

export type TouchOptions = SymlinkFSoption & {
    aTime?: boolean;
    mTime?: boolean;
    noCreate?: boolean;
    date?: Date | string;
    time?: Date | string;
    reference?: string;
};

export type MvOptions = NoClobberFSOption &
    VerboseFSoption &
    ForceFSOption &
    InteractiveFSOption;

export type PreserveOptions = {
    mode?: boolean;
    ownership?: boolean;
    timestamps?: boolean;
    context?: boolean;
    xattr?: boolean;
    all?: boolean;
};

export type CpOptions = VerboseFSoption &
    NoClobberFSOption &
    SymlinkFSoption &
    InteractiveFSOption &
    RecursiveFSOption & {
        hardLink?: boolean;
        noDereference?: boolean;
        noFollowSymlinks?: boolean;
        followAllSymlinks?: boolean;
        followListedSymlinks?: boolean;
        preserve?: PreserveOptions;
        delFirst?: boolean;
        delDest?: boolean;
        archive?: boolean;
    };

export class FailError extends Error {
    constructor(message?: string) {
        super();
        Object.setPrototypeOf(this, PrematureEOFError.prototype);
        this.name = 'FailError';
        this.message = `Failure: ${message}`;
        Error.captureStackTrace(this);
    }
}

export class UnexpectedDataError extends Error {
    public unexpected: string;
    public expected: string;
    constructor(unexpected: string, expected: string) {
        super();
        Object.setPrototypeOf(this, UnexpectedDataError.prototype);
        this.name = 'UnexpectedDataError';
        this.message = `Unexpected '${unexpected}', was expecting ${expected}`;
        this.unexpected = unexpected;
        this.expected = expected;
        Error.captureStackTrace(this);
    }
}
export class PrematureEOFError extends Error {
    public missingBytes: number;
    constructor(howManyMissing: number) {
        super();
        Object.setPrototypeOf(this, PrematureEOFError.prototype);
        this.name = 'PrematureEOFError';
        this.message =
            'Premature end of stream, needed ' + howManyMissing + ' more bytes';
        this.missingBytes = howManyMissing;
        Error.captureStackTrace(this);
    }
}

export class NotConnectedError extends Error {
    constructor() {
        super();
        Object.setPrototypeOf(this, NotConnectedError.prototype);
        this.name = 'NotConnectedError';
        this.message =
            'Client not connected. `connect` function must be called before use.';
        Error.captureStackTrace(this);
    }
}
export class AdbError extends Error {
    errno: number;
    code: string;
    path: string;
    constructor(message: string, errno: number, code: string, path: string) {
        super();
        Object.setPrototypeOf(this, AdbError.prototype);
        this.name = 'AdbError';
        this.message = message;
        this.errno = errno;
        this.code = code;
        this.path = path;
        Error.captureStackTrace(this);
    }
}

export class DataMap extends Map<string, PrimitiveWithDate> {
    toArray(): [string, PrimitiveWithDate][] {
        return [...this.entries()];
    }
    toObject(): PrimitiveDictionary {
        return this.toArray().reduce(
            (obj, [key, val]) => Object.assign(obj, { [key]: val }),
            {}
        );
    }
}
