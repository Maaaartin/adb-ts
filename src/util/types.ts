import Command from '../command';
import IpConnect from '../commands/ipConnect';
import TransportCommand from '../commands/transport';
import Connection from '../connection';
import LogcatEntry from '../logcat/entry';

/** @ignore */
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

/** @ignore */
export type ExecCallback = (err: null | Error) => void;
/** @ignore */
export type ExecCallbackWithValue<T> = (err: null | Error, value: T) => void;

/** @ignore */
export type ExecValue<T = void> = Promise<T> | void;

/** @ignore */
export type DeviceState =
    | 'offline'
    | 'device'
    | 'emulator'
    | 'unauthorized'
    | 'recovery'
    | 'no permissions';

/** @ignore */
export type AdbExtraType =
    | 'string'
    | 'null'
    | 'bool'
    | 'int'
    | 'long'
    | 'float'
    | 'uri'
    | 'component';

/** @ignore */
export type AdbExtra =
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

/** @ignore */
export type NonEmptyArray<T> = [T, ...T[]];

/** @ignore */
export type StartServiceOptions = {
    user?: number | string;
    action?: string;
    data?: string;
    mimeType?: string;
    category?: string | string[];
    flags?: number;
    extras?: AdbExtra | AdbExtra[];
};

/** @ignore */
export type StartActivityOptions = StartServiceOptions & {
    debug?: boolean;
    wait?: boolean;
};

/** @ignore */
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

/** @ignore */
export type StatsObject = {
    bytesTransferred: number;
};

/** @ignore */
export type ReversesForwardsBase = {
    local: string;
    remote: string;
};
/** @ignore */
export type ReversesObject = ReversesForwardsBase & {
    host: string;
};

/** @ignore */
export type ForwardsObject = ReversesForwardsBase & {
    serial: string;
};

/** @ignore */
export type PrimitiveType = string | boolean | number | null | undefined;

/** @ignore */
export type PropertyValue = PrimitiveType | Date;

/** @ignore */
export type PrimitiveDictionary = Record<string, PropertyValue>;

/** @ignore */
export type InstallOptions = {
    reinstall?: boolean;
    test?: boolean;
    internal?: boolean;
    allowDowngrade?: boolean;
    grandPermissions?: boolean;
};

/** @ignore */
export type UninstallOptions = {
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

/** @ignore */
export type LogcatOptions = {
    clear?: boolean;
    filter?: (entry: LogcatEntry) => boolean;
};

/** @ignore */
export type LogcatReaderOptions = {
    filter?: (entry: LogcatEntry) => boolean;
};

/** @ignore */
export type TransportType = 'usb' | 'local';

/** @ignore */
export type WaitForType = TransportType | 'any';

/** @ignore */
export type WaitForState =
    | 'device'
    | 'recovery'
    | 'rescue'
    | 'sideload'
    | 'bootloader'
    | 'disconnect';

/** @ignore */
export type SettingsMode = 'system' | 'global' | 'secure';

/** @ignore */
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

/** @ignore */
export type InputType =
    | 'text'
    | 'keyevent'
    | 'tap'
    | 'swipe'
    | 'draganddrop'
    | 'press'
    | 'roll';

/** @ignore */
export type InputOptions = {
    source?: InputSource;
};

/** @ignore */
export type KeyEventOptions = InputOptions & {
    variant?: 'longpress' | 'doubletap';
};

/** @ignore */
export type InputDurationOptions = InputOptions & { duration?: number };

/** @ignore */
export interface CommandConstruct {
    new (connection: Connection): Command;
}

/** @ignore */
export interface TransportCommandConstruct<T> {
    new (connection: Connection): TransportCommand<T>;
}

/** @ignore */
export interface IpConnectConstruct {
    new (connection: Connection): IpConnect;
}

/** @ignore */
export interface IPreExecute<T> {
    preExecute: (...args: any[]) => Promise<T>;
}

/** @ignore */
export interface ICmd {
    readonly Cmd: string;
}

/** @ignore */
export type MonkeyCallback<T = null> = (
    err: Error | null,
    value: T | null,
    command: string
) => void;

type ForceFSOption = { force?: boolean };
type NoClobberFSOption = { noClobber?: boolean };
type SymlinkFSoption = { symlink?: boolean };
type RecursiveFSOption = { recursive?: boolean };

/** @ignore */
export type RmOptions = ForceFSOption & RecursiveFSOption;

/** @ignore */
export type MkDirOptions = ForceFSOption & {
    mode?: number | string;
    parent?: boolean;
};

/** @ignore */
export type TouchOptions = SymlinkFSoption & {
    aTime?: boolean;
    mTime?: boolean;
    noCreate?: boolean;
    date?: Date | string;
    time?: Date | string;
    reference?: string;
};

/** @ignore */
export type MvOptions = NoClobberFSOption & ForceFSOption;

/** @ignore */
export type PreserveOptions = {
    mode?: boolean;
    ownership?: boolean;
    timestamps?: boolean;
    context?: boolean;
    xattr?: boolean;
    all?: boolean;
};

/** @ignore */
export type CpOptions = NoClobberFSOption &
    SymlinkFSoption &
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
        update?: boolean;
        preserveTimestamps?: boolean;
        copyToTarget?: boolean;
    };

/** @ignore */
export type PropertyMap = Map<string, PropertyValue>;
