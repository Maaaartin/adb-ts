import Command from '../commands/command';
import IpConnect from '../commands/abstract/ipConnect';
import TransportCommand from '../commands/abstract/transport';
import { Connection } from '../connection';
import { LogcatEntry } from '../logcat/entry';

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

export type Callback = (err: null | Error) => void;

export type ValueCallback<T> = (err: null | Error, value: T) => void;

export type DeviceState =
    | 'offline'
    | 'device'
    | 'emulator'
    | 'unauthorized'
    | 'recovery'
    | 'no permissions';

export type ExtraType =
    | 'string'
    | 'null'
    | 'bool'
    | 'int'
    | 'long'
    | 'float'
    | 'uri'
    | 'component';

export type StartExtra =
    | {
          key: string;
          type: 'null';
      }
    | {
          key: string;
          type: 'bool';
          value: boolean;
      }
    | {
          key: string;
          type: 'int' | 'long' | 'float';
          value: number | number[];
      }
    | {
          key: string;
          type: 'string';
          value: string | string[];
      }
    | {
          key: string;
          type: 'component' | 'uri';
          value: string;
      };

export type NonEmptyArray<T> = [T, ...T[]];

export interface StartServiceOptions {
    /**
     * default `0`
     */
    user?: number | string;
    /**
     * Adds `-a` flag.
     */
    action?: string;
    /**
     * Adds `-D` flag.
     */
    data?: string;
    /**
     * Adds `-t` flag.
     */
    mimeType?: string;
    /**
     * Adds `-c` flag.
     */
    category?: string | string[];
    flags?: number;
    extras?: StartExtra | StartExtra[];
}

export interface StartActivityOptions extends StartServiceOptions {
    /**
     * Adds `-D` flag.
     */
    debug?: boolean;
    /**
     * Adds `-W` flag.
     */
    wait?: boolean;
}

export interface IDevice {
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

export type PropertyValue = PrimitiveType | Date;

export type PrimitiveDictionary = Record<string, PropertyValue>;

export type InstallOptions = {
    /**
     * Adds `-r` flag to the install command.
     */
    reinstall?: boolean;
    /**
     * Adds `-t` flag to the install command.
     */
    test?: boolean;
    /**
     * Adds `-f` flag to the install command.
     */
    internal?: boolean;
    /**
     * Adds `-d` flag to the install command.
     */
    allowDowngrade?: boolean;
    /**
     * Adds `-g` flag to the install command.
     */
    grandPermissions?: boolean;
};

export type UninstallOptions = {
    /**
     * Adds `-k` flag to the install command.
     */
    keepCache?: boolean;
};

export type AdbClientOptionsValues = {
    /**
     * - *default `5037`*
     */
    port: number;
    /**
     * - *path to adb.exe, if not set, env path is taken*
     */
    bin: string;
    /**
     * - *default `localhost`*
     */
    host: string;
    /**
     * - *if false, module will not attempt to start adb server*
     */
    noAutoStart: boolean;
};

/**
 * @see {@link AdbClientOptionsValues}
 */
export type AdbClientOptions = {
    [K in keyof AdbClientOptionsValues]?: AdbClientOptionsValues[K];
};

export type LogcatOptions = {
    clear?: boolean;
    /**
     * e.g. `(entry) =>
            entry.message.includes('some string') &&
            entry.priority >= Priority.FATAL`
     */
    filter?: (entry: LogcatEntry) => boolean;
};

/**
 * @see {@link LogcatOptions}
 */
export type LogcatReaderOptions = {
    filter?: (entry: LogcatEntry) => boolean;
};

export type TransportType = 'usb' | 'local';

export type WaitForType = TransportType | 'any';

export type WaitForState =
    | 'device'
    | 'recovery'
    | 'rescue'
    | 'sideload'
    | 'bootloader'
    | 'disconnect';

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

export interface KeyEventOptions extends InputOptions {
    variant?: 'longpress' | 'doubletap';
}

export interface InputDurationOptions extends InputOptions {
    /**
     * Duration in milliseconds.
     */
    duration?: number;
}

export interface CommandConstruct<T> {
    new (connection: Connection, ...args: any[]): Command<T>;
}

export interface TransportCommandConstruct<T> {
    new (
        connection: Connection,
        serial: string,
        ...args: any[]
    ): TransportCommand<T>;
}

export interface IpConnectConstruct {
    /** @ignore */
    new (connection: Connection, host: string, port: number): IpConnect;
}

export type MonkeyCallback<T = null> = (
    err: Error | null,
    value: T | null,
    command: string
) => void;

export interface ForceFSOption {
    /**
     * Adds `-f` flag.
     */
    force?: boolean;
}
export interface NoClobberFSOption {
    /**
     * Adds `-n` flag.
     * No override.
     */
    noClobber?: boolean;
}
export interface SymlinkFSoption {
    /**
     * Adds `-s` flag.
     * Creates symlink.
     */
    symlink?: boolean;
}
export interface RecursiveFSOption {
    /**
     * Adds `-r` flag.
     */
    recursive?: boolean;
}

export interface RmOptions extends ForceFSOption, RecursiveFSOption {}

export interface MkDirOptions extends ForceFSOption {
    /**
     * Adds `-m <value>` flag. Sets access mode
     */
    mode?: number | string;
    /**
     * Adds `-p` flag.
     * Creates parent directory if needed.
     */
    parent?: boolean;
}

export interface TouchOptions extends SymlinkFSoption {
    /**
     * Adds `-a` flag. Changes access time.
     */
    aTime?: boolean;
    /**
     * Adds `-m` flag. Changes modification time.
     */
    mTime?: boolean;
    /**
     * Adds `-m` flag. Does not create file. Does not create file.
     */
    noCreate?: boolean;
    /**
     * Adds `-d <date>` flag.
     */
    date?: Date | string;
    /**
     * Adds `-t <time>` flag.
     */
    time?: Date | string;
    /**
     * Adds `-r <reference>` flag.
     */
    reference?: string;
}

export interface MvOptions extends NoClobberFSOption, ForceFSOption {}

export type PreserveOptions = {
    mode?: boolean;
    ownership?: boolean;
    timestamps?: boolean;
    context?: boolean;
    xattr?: boolean;
    /**
     * All of other options.
     */
    all?: boolean;
};

export interface CpOptions
    extends NoClobberFSOption,
        SymlinkFSoption,
        RecursiveFSOption {
    /**
     * Adds `-l` flag.
     */
    hardLink?: boolean;
    /**
     * Adds `-d` flag.
     */
    noDereference?: boolean;
    /**
     * Adds `-P` flag.
     */
    noFollowSymlinks?: boolean;
    /**
     * Adds `-L` flag.
     */
    followAllSymlinks?: boolean;
    /**
     * Adds `-H` flag.
     */
    followListedSymlinks?: boolean;
    /**
     * Adds `--preserve=[ATTRIBUTES]`.
     */
    preserve?: PreserveOptions;
    /**
     * Adds `-F` flag.
     */
    delFirst?: boolean;
    /**
     * Adds `-f` flag.
     */
    delDest?: boolean;
    /**
     * Adds `-a` flag.
     * Same as `-dpr`, if specified, `noDereference`, `preserve` and `recursive` attributes are ignored
     */
    archive?: boolean;
    /**
     * Adds `-u` flag.
     */
    update?: boolean;
    /**
     * Adds `-p` flag.
     */
    preserveTimestamps?: boolean;
    /**
     * Adds `-t` flag.
     */
    copyToTarget?: boolean;
}

export type PropertyMap = Map<string, PropertyValue>;

export type NonFunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends () => void ? never : K;
}[keyof T];

export type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export type NonNullable<T> = Exclude<T, undefined>;

export type ArgsMapper<T> = {
    [K in keyof T]-?:
        | string
        | ((value: NonNullable<T[K]>) => string | string[]);
};
