export { default as AdbClient } from './client';
export { default as Command } from './command';
export { default as EmptyCommand } from './commands/empty-command';
export { default as ParseCommand } from './commands/parse-command';
export { default as RawCommand } from './commands/raw-command';
export { default as TransportCommand } from './commands/tranport';
export { default as TransportParseAllCommand } from './commands/transport-parse-all-command';
export { default as TransportParseValueCommand } from './commands/transport-parse-value-command';
export { default as ValueCommand } from './commands/value-command';
export { KeyCode } from './keycode';
export { default as LineTransform } from './linetransform';
export { default as Parser } from './parser';
export { default as Sync } from './sync';
export { default as Tracker } from './tracker';

import Command from './command';
import Connection from './connection';
import { EventEmitter } from 'events';
import LogcatEntry from './logcat/entry';

export enum Priority {
  DEFAULT = 1,
  VERBOSE = 2,
  DEBUG = 3,
  INFO = 4,
  WARN = 5,
  ERROR = 6,
  FATAL = 7,
  SILENT = 8,
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
  QUIT = 'QUIT',
}

export function decodeLength(length: string) {
  return parseInt(length, 16);
}

export function encodeLength(length: number) {
  return ('0000' + length.toString(16)).slice(-4).toUpperCase();
}

export function encodeData(data: any) {
  if (!Buffer.isBuffer(data)) {
    data = Buffer.from(data);
  }
  return Buffer.concat([Buffer.from(encodeLength(data.length)), data]);
}

export function stringToType(value: string): SimpleType {
  const num = Number(value);
  if (isNaN(num) || value === '') {
    switch (value) {
      case '':
        return undefined;
      case 'true':
        return true;
      case 'false':
        return false;
      case 'null':
        return null;
      default:
        return value;
    }
  } else {
    return num;
  }
}

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
  value: SimpleType | SimpleType[];
};
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
  path: string;
  device?: string;
  model?: string;
  product?: string;
  transportId?: string;
  transport: TransportType;
}

export interface AdbError extends Error {
  errno?: number;
  code?: string;
  path?: string;
}

export type StatsObject = {
  bytesTransferred: number;
};

export interface ReversesObject {
  local: string;
  remote: string;
}

export interface ForwardsObject extends ReversesObject {
  serial: string;
}

export type SimpleType = string | boolean | number | null | undefined;

export type KeyStringObject = { [key: string]: SimpleType };

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

export interface AdbClientOptions {
  port?: number;
  bin?: string;
  host?: string;
  noAutoStart?: boolean;
}

export interface LogcatOptions {
  clear?: boolean;
  filter?: (entry: LogcatEntry) => boolean;
}

export interface LogcatReaderOptions {
  fixLineFeeds?: boolean;
  filter?: (entry: LogcatEntry) => boolean;
}

export type TransportType = 'usb' | 'local' | 'any';

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

export abstract class StreamHandler extends EventEmitter {
  abstract end(): Promise<void>;
}

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
    // hack
    Object.setPrototypeOf(this, PrematureEOFError.prototype);
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
    Object.setPrototypeOf(this, PrematureEOFError.prototype);
    this.name = 'NotConnectedError';
    this.message =
      'Client not connected. `connect` function must be called before use.';
    Error.captureStackTrace(this);
  }
}
