import {
    AdbClientOptions,
    AdbClientOptionsValues,
    ADB_DEFAULT_PORT,
    CommandConstruct,
    CpOptions,
    ExecCallback,
    ExecCallbackWithValue,
    ForwardsObject,
    IAdbDevice,
    InputOptions,
    InputSource,
    InstallOptions,
    PrimitiveDictionary,
    LogcatOptions,
    MkDirOptions,
    MvOptions,
    nodeify,
    ReversesObject,
    RmOption,
    SettingsMode,
    PrimitiveType,
    StartActivityOptions,
    StartServiceOptions,
    TouchOptions,
    TransportType,
    UninstallOptions,
    WaitForState
} from '.';
import Sync, { SyncMode } from './sync';
import { exec, execFile } from 'child_process';
import fs, { Stats } from 'fs';
import AdbDevice from './device';
import BatteryStatusCommand from './commands/host-trasport/baterrystatus';
import ClearCommand from './commands/host-trasport/clear';
import ConnectCommand from './commands/host/connect';
import Connection from './connection';
import CpCommand from './commands/host-trasport/cp';
import DisconnectCommand from './commands/host/disconnect';
import { EventEmitter } from 'events';
import FileStatCommand from './commands/host-trasport/filestat';
import FileStats from './filestats';
import ForwardCommand from './commands/host-serial/forward';
import GetDevicePathCommand from './commands/host-serial/getdevicepath';
import GetIpAddressCommand from './commands/host-trasport/ipaddress';
import GetPropertyCommand from './commands/host-trasport/getproperty';
import GetSetting from './commands/host-trasport/getsetting';
import HostTransportCommand from './commands/host/transport';
import InputCommand from './commands/host-trasport/input';
import InstallCommand from './commands/host-trasport/install';
import IsInstalledCommand from './commands/host-trasport/isinstalled';
import Jimp from 'jimp';
import { KeyCode } from './keycode';
import KillCommand from './commands/host/kill';
import ListDevicesCommand from './commands/host/listdevices';
import ListFeaturesCommand from './commands/host-trasport/listfeatures';
import ListForwardsCommand from './commands/host-serial/listforwards';
import ListPackagesCommand from './commands/host-trasport/listpackages';
import ListPropertiesCommand from './commands/host-trasport/listproperties';
import ListReversesCommand from './commands/host-trasport/listreverses';
import ListSettingsCommand from './commands/host-trasport/listsettings';
import Logcat from './logcat';
import LogcatCommand from './commands/host-trasport/logcat';
import LogcatReader from './logcat/reader';
import MkDirCommand from './commands/host-trasport/mkdir';
import Monkey from './monkey/client';
import MonkeyCommand from './commands/host-trasport/monkey';
import MvCommand from './commands/host-trasport/mv';
import Parser from './parser';
import PullTransfer from './sync/pulltransfer';
import PushTransfer from './sync/pushtransfer';
import PutSetting from './commands/host-trasport/putsetting';
import { Readable } from 'stream';
import RebootCommand from './commands/host-trasport/reboot';
import RemountCommand from './commands/host-trasport/remount';
import ReverseCommand from './commands/host-trasport/reverse';
import RmCommand from './commands/host-trasport/rm';
import RootCommand from './commands/host-trasport/root';
import ScreenShotCommand from './commands/host-trasport/screencap';
import SetProp from './commands/host-trasport/setproperty';
import ShellCommand from './commands/host-trasport/shell';
import ShellRawCommand from './commands/host-trasport/shellraw';
import ShutdownCommand from './commands/host-trasport/shutdown';
import StartActivityCommand from './commands/host-trasport/startactivity';
import StartServiceCommand from './commands/host-trasport/startservice';
import SyncCommand from './commands/host-trasport/sync';
import SyncEntry from './sync/entry';
import TcpCommand from './commands/host-trasport/tcp';
import TcpIpCommand from './commands/host-trasport/tcpip';
import TouchCommand from './commands/host-trasport/touch';
import TrackCommand from './commands/host/trackdevices';
import Tracker from './tracker';
import UninstallCommand from './commands/host-trasport/uninstall';
import UsbCommand from './commands/host-trasport/usb';
import VersionCommand from './commands/host/version';
import WaitBootCompleteCommand from './commands/host-trasport/wainbootcomplete';
import WaitForDeviceCommand from './commands/host/waitfordevice';

function buildInputParams(
    defaultSource: InputSource,
    source: InputOptions | InputSource | ExecCallback | undefined,
    cb: ExecCallback | undefined
): { source: InputSource; cb: ExecCallback | undefined } {
    if (typeof source === 'function') {
        cb = source;
    } else if (typeof source !== 'undefined') {
        if (typeof source === 'object') {
            if (typeof source.source !== 'undefined') {
                defaultSource = source.source;
            }
        } else {
            defaultSource = source;
        }
    }
    return { source: defaultSource, cb };
}
export default class AdbClient extends EventEmitter {
    public static readonly defaultOptions: Readonly<AdbClientOptionsValues> =
        Object.freeze({
            port: 5037,
            host: 'localhost',
            bin: 'adb',
            noAutoStart: false
        });
    private options: AdbClientOptionsValues;
    constructor(options?: AdbClientOptions) {
        super();
        this.options = Object.entries(options || {})
            .filter(([_key, value]) => typeof value !== 'undefined')
            .reduce(
                (def, opt) => ({ ...def, ...opt }),
                AdbClient.defaultOptions
            );
    }

    startServer(): Promise<void>;
    startServer(cb?: (err: null | Error) => void): void;
    startServer(cb?: (err: null | Error) => void): Promise<void> | void {
        const port = this.options.port;
        const args = port
            ? ['-P', port.toString(), 'start-server']
            : ['start-server'];
        return nodeify(
            new Promise<void>((resolve, reject) => {
                execFile(this.options.bin, args, (err) =>
                    err ? reject(err) : resolve()
                );
            }),
            cb
        );
    }

    private connection() {
        let triedStarting = false;
        const connection = new Connection();
        return new Promise<Connection>((resolve, reject) => {
            connection.connect(this.options);
            connection.once('connect', () => {
                return resolve(connection);
            });
            connection.on('error', (err: any) => {
                if (
                    err.code === 'ECONNREFUSED' &&
                    !triedStarting &&
                    !this.options?.noAutoStart
                ) {
                    triedStarting = true;
                    return this.startServer().then(() => {
                        return connection.connect(this.options);
                    });
                } else {
                    connection.end();
                    connection.removeAllListeners();
                    return reject(err);
                }
            });
        });
    }

    transport(serial: string): Promise<Connection> {
        return this.connection().then((conn) =>
            new HostTransportCommand(conn).execute(serial).then(() => conn)
        );
    }

    version(): Promise<number>;
    version(cb?: (err: null | Error, value: number) => void): void;
    version(
        cb?: (err: null | Error, value: number) => void
    ): Promise<number> | void {
        return nodeify(
            this.connection().then((conn) =>
                new VersionCommand(conn).execute()
            ),
            cb
        );
    }

    connect(
        host: string,
        cb?: (err: Error, value: number) => void
    ): Promise<string>;
    connect(
        host: string,
        port?: number,
        cb?: (err: null | Error, value: string) => void
    ): Promise<string>;
    connect(
        host: string,
        port?: any,
        cb?: (err: null | Error, value: string) => void
    ) {
        if (typeof port === 'function') {
            cb = port;
            port = undefined;
        }
        if (host.indexOf(':') !== -1) {
            [host, port] = host.split(':', 2);
        }
        port = port || ADB_DEFAULT_PORT;
        return nodeify(
            this.connection().then((conn) =>
                new ConnectCommand(conn).execute(host, port)
            ),
            cb
        );
    }
    disconnect(
        host: string,
        cb?: (err: Error, value: number) => void
    ): Promise<string>;
    disconnect(
        host: string,
        port?: number,
        cb?: (err: Error, value: number) => void
    ): Promise<string>;
    disconnect(
        host: string,
        port?: any,
        cb?: (err: Error, value: number) => void
    ) {
        if (typeof port === 'function') {
            cb = port;
            port = undefined;
        }
        if (host.indexOf(':') !== -1) {
            const tmp = host.split(':', 2);
            host = tmp[0];
            port = Number(tmp[1]);
        }
        if (!port) port = 5555;
        return this.connection().then((conn) => {
            return new DisconnectCommand(conn).execute(host, port);
        });
    }

    listDevices(): Promise<IAdbDevice[]>;
    listDevices(cb?: ExecCallbackWithValue<IAdbDevice[]>): void;
    listDevices(
        cb?: ExecCallbackWithValue<IAdbDevice[]>
    ): Promise<IAdbDevice[]> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ListDevicesCommand(conn).execute()
            ),
            cb
        );
    }

    trackDevices(): Promise<Tracker>;
    trackDevices(cb?: ExecCallbackWithValue<Tracker>): void;
    trackDevices(cb?: ExecCallbackWithValue<Tracker>): Promise<Tracker> | void {
        return nodeify(
            this.connection().then((conn) => {
                const command = new TrackCommand(conn);
                return command.execute().then(() => new Tracker(command, this));
            }),
            cb
        );
    }

    kill(): Promise<void>;
    kill(cb?: ExecCallback): void;
    kill(cb?: ExecCallback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) => new KillCommand(conn).execute()),
            cb
        );
    }

    getSerialNo(serial: string): Promise<string>;
    getSerialNo(serial: string, cb?: ExecCallbackWithValue<string>): void;
    getSerialNo(
        serial: string,
        cb?: ExecCallbackWithValue<string>
    ): Promise<string> | void {
        return this.getProp(
            serial,
            'ro.serialno',
            cb && ((e, v) => cb(e, `${v}`))
        );
    }

    getDevicePath(serial: string): Promise<string>;
    getDevicePath(serial: string, cb?: ExecCallbackWithValue<string>): void;
    getDevicePath(
        serial: string,
        cb?: ExecCallbackWithValue<string>
    ): Promise<string> | void {
        return nodeify(
            this.connection().then((conn) =>
                new GetDevicePathCommand(conn).execute(serial)
            ),
            cb
        );
    }

    listProperties(serial: string): Promise<PrimitiveDictionary>;
    listProperties(
        serial: string,
        cb?: ExecCallbackWithValue<PrimitiveDictionary>
    ): void;
    listProperties(
        serial: string,
        cb?: ExecCallbackWithValue<PrimitiveDictionary>
    ): Promise<PrimitiveDictionary> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ListPropertiesCommand(conn).execute(serial)
            ),
            cb
        );
    }

    listFeatures(serial: string): Promise<PrimitiveDictionary>;
    listFeatures(
        serial: string,
        cb?: ExecCallbackWithValue<PrimitiveDictionary>
    ): void;
    listFeatures(
        serial: string,
        cb?: ExecCallbackWithValue<PrimitiveDictionary>
    ): Promise<PrimitiveDictionary> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ListFeaturesCommand(conn).execute(serial)
            ),
            cb
        );
    }

    listPackages(serial: string): Promise<string[]>;
    listPackages(serial: string, cb?: ExecCallbackWithValue<string[]>): void;
    listPackages(
        serial: string,
        cb?: ExecCallbackWithValue<string[]>
    ): Promise<string[]> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ListPackagesCommand(conn).execute(serial)
            ),
            cb
        );
    }

    getIpAddress(serial: string): Promise<string>;
    getIpAddress(serial: string, cb?: ExecCallbackWithValue<string>): void;
    getIpAddress(
        serial: string,
        cb?: ExecCallbackWithValue<string>
    ): Promise<string> | void {
        return nodeify(
            this.connection().then((conn) =>
                new GetIpAddressCommand(conn).execute(serial)
            ),
            cb
        );
    }

    forward(serial: string, local: string, remote: string): Promise<void>;
    forward(
        serial: string,
        local: string,
        remote: string,
        cb?: ExecCallback
    ): void;
    forward(
        serial: string,
        local: string,
        remote: string,
        cb?: ExecCallback
    ): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ForwardCommand(conn).execute(serial, local, remote)
            ),
            cb
        );
    }

    listForwards(serial: string): Promise<ForwardsObject[]>;
    listForwards(
        serial: string,
        cb?: ExecCallbackWithValue<ForwardsObject[]>
    ): void;
    listForwards(
        serial: string,
        cb?: ExecCallbackWithValue<ForwardsObject[]>
    ): Promise<ForwardsObject[]> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ListForwardsCommand(conn).execute(serial)
            ),
            cb
        );
    }

    reverse(serial: string, local: string, remote: string): Promise<void>;
    reverse(
        serial: string,
        local: string,
        remote: string,
        cb?: ExecCallback
    ): void;
    reverse(
        serial: string,
        local: string,
        remote: string,
        cb?: ExecCallback
    ): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ReverseCommand(conn).execute(serial, local, remote)
            ),
            cb
        );
    }

    listReverses(serial: string): Promise<ReversesObject[]>;
    listReverses(
        serial: string,
        cb?: ExecCallbackWithValue<ReversesObject[]>
    ): void;
    listReverses(
        serial: string,
        cb?: ExecCallbackWithValue<ReversesObject[]>
    ): Promise<ReversesObject[]> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new ListReversesCommand(conn).execute(serial);
            }),
            cb
        );
    }

    private shellInternal(serial: string, command: string | string[]) {
        return this.connection().then((conn) => {
            return new ShellRawCommand(conn).execute(serial, command);
        });
    }

    reboot(serial: string): Promise<void>;
    reboot(serial: string, cb?: ExecCallback): void;
    reboot(serial: string, cb?: ExecCallback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new RebootCommand(conn).execute(serial)
            ),
            cb
        );
    }

    shutdown(serial: string): Promise<void>;
    shutdown(serial: string, cb?: ExecCallback): void;
    shutdown(serial: string, cb?: ExecCallback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ShutdownCommand(conn).execute(serial)
            ),
            cb
        );
    }

    remount(serial: string): Promise<void>;
    remount(serial: string, cb?: ExecCallback): void;
    remount(serial: string, cb?: ExecCallback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new RemountCommand(conn).execute(serial)
            ),
            cb
        );
    }

    root(serial: string): Promise<void>;
    root(serial: string, cb?: ExecCallback): void;
    root(serial: string, cb?: ExecCallback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new RootCommand(conn).execute(serial)
            ),
            cb
        );
    }

    screenshot(serial: string): Promise<Jimp>;
    screenshot(serial: string, cb?: ExecCallbackWithValue<Jimp>): void;
    screenshot(
        serial: string,
        cb?: ExecCallbackWithValue<Jimp>
    ): Promise<Jimp> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new ScreenShotCommand(conn)
                    .execute(serial)
                    .then((transform) => {
                        return new Promise<Jimp>((resolve, reject) => {
                            const bufs: Buffer[] = [];
                            transform.on('data', (data) => {
                                bufs.push(data);
                            });
                            transform.on('end', () => {
                                Jimp.read(Buffer.concat(bufs))
                                    .then(resolve)
                                    .catch(reject);
                            });
                            transform.on('error', reject);
                        });
                    });
            }),
            cb
        );
    }

    openTcp(serial: string, port: number | string): Promise<Connection>;
    openTcp(
        serial: string,
        port: number | string,
        host?: string,
        cb?: ExecCallbackWithValue<Connection>
    ): void;
    openTcp(
        serial: string,
        port: number | string,
        host?: any,
        cb?: ExecCallbackWithValue<Connection>
    ): Promise<Connection> | void {
        return nodeify(
            this.transport(serial).then((conn) => {
                return new TcpCommand(conn).execute(port, host);
            }),
            cb
        );
    }

    roll(serial: string, x: number, y: number): Promise<void>;
    roll(
        serial: string,
        x: number,
        y: number,
        source: InputSource
    ): Promise<void>;
    roll(serial: string, x: number, y: number, cb?: ExecCallback): void;
    roll(
        serial: string,
        x: number,
        y: number,
        source: InputSource,
        cb?: ExecCallback
    ): void;
    roll(
        serial: string,
        x: number,
        y: number,
        source?: InputSource | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        const { source: _source, cb: _cb } = buildInputParams(
            'trackball',
            source,
            cb
        );

        return nodeify(
            this.connection().then((conn) => {
                return new InputCommand(conn).execute(
                    serial,
                    _source,
                    'roll',
                    x,
                    y
                );
            }),
            _cb
        );
    }

    press(serial: string): Promise<void>;
    press(serial: string, source: InputSource): Promise<void>;
    press(serial: string, cb: ExecCallback): void;
    press(serial: string, source: InputSource, cb: ExecCallback): void;
    press(
        serial: string,
        source?: InputSource | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        const { source: _source, cb: _cb } = buildInputParams(
            'trackball',
            source,
            cb
        );
        return nodeify(
            this.connection().then((conn) => {
                return new InputCommand(conn).execute(serial, _source, 'press');
            }),
            _cb
        );
    }

    dragAndDrop(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): Promise<void>;
    dragAndDrop(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options: InputOptions & { duration?: number }
    ): Promise<void>;
    dragAndDrop(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        cb: ExecCallback
    ): void;
    dragAndDrop(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options: InputOptions & { duration?: number },
        cb: ExecCallback
    ): void;
    dragAndDrop(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: (InputOptions & { duration?: number }) | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        const { source: _source, cb: _cb } = buildInputParams(
            'touchscreen',
            options,
            cb
        );

        return nodeify(
            this.connection().then((conn) => {
                return new InputCommand(conn).execute(
                    serial,
                    _source,
                    'draganddrop',
                    x1,
                    y1,
                    x2,
                    y2,
                    typeof options === 'object' &&
                        typeof options.duration === 'number'
                        ? options.duration.toString()
                        : ''
                );
            }),
            _cb
        );
    }

    swipe(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): Promise<void>;
    swipe(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options: InputOptions & { duration?: number }
    ): Promise<void>;
    swipe(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        cb: ExecCallback
    ): void;
    swipe(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options: InputOptions & { duration?: number },
        cb: ExecCallback
    ): void;
    swipe(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: (InputOptions & { duration?: number }) | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        const { source: _source, cb: _cb } = buildInputParams(
            'touchscreen',
            options,
            cb
        );
        return nodeify(
            this.connection().then((conn) => {
                return new InputCommand(conn).execute(
                    serial,
                    _source,
                    'swipe',
                    x1,
                    y1,
                    x2,
                    y2,
                    typeof options === 'object' &&
                        typeof options.duration === 'number'
                        ? options.duration.toString()
                        : ''
                );
            }),
            _cb
        );
    }

    keyEvent(serial: string, code: KeyCode | number): Promise<void>;
    keyEvent(
        serial: string,
        code: KeyCode | number,
        options: InputOptions & { longpress?: boolean }
    ): Promise<void>;
    keyEvent(serial: string, code: KeyCode | number, cb: ExecCallback): void;
    keyEvent(
        serial: string,
        code: KeyCode | number,
        options: InputOptions & { longpress?: boolean },
        cb: ExecCallback
    ): void;
    keyEvent(
        serial: string,
        code: KeyCode | number,
        options?: (InputOptions & { longpress?: boolean }) | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        const { source: _source, cb: _cb } = buildInputParams(
            'keyboard',
            options,
            cb
        );

        return nodeify(
            this.connection().then((conn) => {
                return new InputCommand(conn).execute(
                    serial,
                    'keyevent',
                    _source,
                    code,
                    typeof options === 'object' && options.longpress
                        ? '--longpress'
                        : ''
                );
            }),
            _cb
        );
    }

    tap(serial: string, x: number, y: number): Promise<void>;
    tap(
        serial: string,
        x: number,
        y: number,
        source: InputSource
    ): Promise<void>;
    tap(serial: string, x: number, y: number, cb: ExecCallback): void;
    tap(
        serial: string,
        x: number,
        y: number,
        source: InputSource,
        cb: ExecCallback
    ): void;
    tap(
        serial: string,
        x: number,
        y: number,
        source?: InputSource | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        const { source: _source, cb: _cb } = buildInputParams(
            'touchscreen',
            source,
            cb
        );

        return nodeify(
            this.connection().then((conn) => {
                return new InputCommand(conn).execute(
                    serial,
                    _source,
                    'tap',
                    x,
                    y
                );
            }),
            _cb
        );
    }

    text(serial: string, text: string): Promise<void>;
    text(serial: string, text: string, source: InputSource): Promise<void>;
    text(serial: string, text: string, cb?: ExecCallback): void;
    text(
        serial: string,
        text: string,
        source: InputSource,
        cb: ExecCallback
    ): void;
    text(
        serial: string,
        text: string,
        source?: InputSource | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        const { source: _source, cb: _cb } = buildInputParams(
            'touchscreen',
            source,
            cb
        );
        return nodeify(
            this.connection().then((conn) => {
                return new InputCommand(conn).execute(
                    serial,
                    _source,
                    'text',
                    text
                );
            }),
            _cb
        );
    }

    openLogcat(serial: string): Promise<LogcatReader>;
    openLogcat(serial: string, options: LogcatOptions): Promise<LogcatReader>;
    openLogcat(serial: string, cb: ExecCallbackWithValue<LogcatReader>): void;
    openLogcat(
        serial: string,
        options: LogcatOptions,
        cb: ExecCallbackWithValue<LogcatReader>
    ): void;
    openLogcat(
        serial: string,
        options?: ExecCallbackWithValue<LogcatReader> | LogcatOptions,
        cb?: ExecCallbackWithValue<LogcatReader>
    ): Promise<LogcatReader> | void {
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        }

        return nodeify(
            this.connection().then((conn) => {
                return new LogcatCommand(conn)
                    .execute(
                        serial,
                        typeof options === 'object' ? options : undefined
                    )
                    .then((stream) => {
                        const logCat = Logcat.readStrem(stream, {
                            ...options,
                            fixLineFeeds: false
                        });
                        conn.on('error', (err) => logCat.emit('error', err));
                        return logCat;
                    });
            }),
            cb
        );
    }

    private syncService(serial: string) {
        return this.connection().then((conn) => {
            return new SyncCommand(conn).execute(serial);
        });
    }

    clear(serial: string, pkg: string): Promise<void>;
    clear(serial: string, pkg: string, cb: ExecCallback): void;
    clear(
        serial: string,
        pkg: string,
        cb?: ExecCallback
    ): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new ClearCommand(conn).execute(serial, pkg);
            }),
            cb
        );
    }

    private installRemote(
        serial: string,
        apk: string,
        options?: InstallOptions,
        args?: string
    ): Promise<void> {
        return this.connection().then((conn) => {
            return new InstallCommand(conn)
                .execute(serial, apk, options, args)
                .then(() => {
                    return this.shellInternal(serial, ['rm', '-f', apk]).then(
                        (stream) => {
                            return new Parser(stream).readAll().then(() => {});
                        }
                    );
                });
        });
    }

    install(serial: string, apk: string | Readable): Promise<void>;
    install(
        serial: string,
        apk: string | Readable,
        options: InstallOptions
    ): Promise<void>;
    install(
        serial: string,
        apk: string | Readable,
        options: InstallOptions,
        args: string
    ): Promise<void>;
    install(serial: string, apk: string | Readable, cb: ExecCallback): void;
    install(
        serial: string,
        apk: string | Readable,
        options: InstallOptions,
        cb: ExecCallback
    ): void;
    install(
        serial: string,
        apk: string | Readable,
        options: InstallOptions,
        args: string,
        cb: ExecCallback
    ): void;

    install(
        serial: string,
        apk: string | Readable,
        options?: InstallOptions | ExecCallback,
        args?: string | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        let options_: InstallOptions = {},
            args_: string = '';
        if (typeof options === 'function') {
            cb = options;
            options = undefined;
        } else if (typeof options === 'object') {
            options_ = options;
        }
        if (typeof args === 'function') {
            cb = args;
            args = undefined;
        } else if (typeof args === 'string') {
            args_ = args;
        }
        const temp = Sync.temp(typeof apk === 'string' ? apk : '_stream.apk');
        return nodeify(
            this.push(serial, apk, temp).then((transfer) => {
                let errorListener: (err: Error) => void;
                let endListener: VoidFunction;
                return new Promise<void>((resolve, reject) => {
                    transfer.on(
                        'error',
                        (errorListener = (err) => {
                            reject(err);
                        })
                    );
                    transfer.on(
                        'end',
                        (endListener = () => {
                            this.installRemote(serial, temp, options_, args_)
                                .then(resolve)
                                .catch(reject);
                        })
                    );
                }).finally(() => {
                    transfer.removeListener('error', errorListener);
                    return transfer.removeListener('end', endListener);
                });
            }),
            cb
        );
    }

    uninstall(serial: string, pkg: string): Promise<void>;
    uninstall(serial: string, pkg: string): Promise<void>;
    uninstall(serial: string, pkg: string, cb: ExecCallback): void;
    uninstall(
        serial: string,
        pkg: string,
        options: UninstallOptions,
        cb: ExecCallback
    ): void;
    uninstall(
        serial: string,
        pkg: string,
        options?: ExecCallback | UninstallOptions,
        cb?: ExecCallback
    ): Promise<void> | void {
        let options_: UninstallOptions;
        if (typeof options === 'function') {
            cb = options;
        } else if (typeof options === 'object') {
            options_ = options;
        }
        return nodeify(
            this.connection().then((conn) => {
                return new UninstallCommand(conn).execute(
                    serial,
                    pkg,
                    options_
                );
            }),
            cb
        );
    }

    isInstalled(serial: string, pkg: string): Promise<boolean>;
    isInstalled(
        serial: string,
        pkg: string,
        cb: ExecCallbackWithValue<boolean>
    ): void;
    isInstalled(
        serial: string,
        pkg: string,
        cb?: ExecCallbackWithValue<boolean>
    ): Promise<boolean> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new IsInstalledCommand(conn).execute(serial, pkg);
            }),
            cb
        );
    }

    startActivity(serial: string, pkg: string, activity: string): Promise<void>;
    startActivity(
        serial: string,
        pkg: string,
        activity: string,
        options: StartActivityOptions
    ): Promise<void>;
    startActivity(
        serial: string,
        pkg: string,
        activity: string,
        cb: ExecCallback
    ): void;
    startActivity(
        serial: string,
        pkg: string,
        activity: string,
        options: StartActivityOptions,
        cb: ExecCallback
    ): void;
    startActivity(
        serial: string,
        pkg: string,
        activity: string,
        options?: StartActivityOptions | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        let options_: StartActivityOptions;
        if (typeof options === 'function') {
            cb = options;
        } else if (typeof options === 'object') {
            options_ = options;
        }
        return nodeify(
            this.connection().then((conn) => {
                return new StartActivityCommand(conn).execute(
                    serial,
                    pkg,
                    activity,
                    options_
                );
            }),
            cb
        );
    }

    startService(serial: string, pkg: string, service: string): Promise<void>;
    startService(
        serial: string,
        pkg: string,
        service: string,
        options: StartServiceOptions
    ): Promise<void>;
    startService(
        serial: string,
        pkg: string,
        service: string,
        cb: ExecCallback
    ): void;
    startService(
        serial: string,
        pkg: string,
        service: string,
        options: StartServiceOptions,
        cb: ExecCallback
    ): void;
    startService(
        serial: string,
        pkg: string,
        service: string,
        options?: StartServiceOptions | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        let options_: StartServiceOptions;
        if (typeof options === 'function') {
            cb = options;
        } else if (typeof options === 'object') {
            options_ = options;
        }

        return nodeify(
            this.connection().then((conn) => {
                return new StartServiceCommand(conn).execute(
                    serial,
                    pkg,
                    service,
                    options_
                );
            }),
            cb
        );
    }

    stat(serial: string, path: string): Promise<Stats>;
    stat(serial: string, path: string, cb: ExecCallbackWithValue<Stats>): void;
    stat(
        serial: string,
        path: string,
        cb?: ExecCallbackWithValue<Stats>
    ): Promise<Stats> | void {
        process.emitWarning('Use fileStats() function instead', 'Warning');
        return nodeify(
            this.syncService(serial).then((sync) => {
                return sync.stat(path).finally(() => {
                    return sync.end();
                });
            }),
            cb
        );
    }

    readDir(serial: string, path: string): Promise<SyncEntry[]>;
    readDir(
        serial: string,
        path: string,
        cb: ExecCallbackWithValue<SyncEntry[]>
    ): void;
    readDir(
        serial: string,
        path: string,
        cb?: ExecCallbackWithValue<SyncEntry[]>
    ): Promise<SyncEntry[]> | void {
        return nodeify(
            this.syncService(serial).then((sync) => {
                return sync.readDir(path).finally(() => {
                    return sync.end();
                });
            }),
            cb
        );
    }

    pull(serial: string, path: string): Promise<PullTransfer>;
    pull(
        serial: string,
        path: string,
        cb: ExecCallbackWithValue<PullTransfer>
    ): void;

    pull(
        serial: string,
        path: string,
        cb?: ExecCallbackWithValue<PullTransfer>
    ): Promise<PullTransfer> | void {
        return nodeify(
            this.syncService(serial).then((sync) => {
                return sync.pull(path).on('end', () => {
                    sync.end();
                });
            }),
            cb
        );
    }

    push(
        serial: string,
        srcPath: string | Readable,
        destPath: string
    ): Promise<PushTransfer>;
    push(
        serial: string,
        srcPath: string | Readable,
        destPath: string,
        mode: SyncMode
    ): Promise<PushTransfer>;
    push(
        serial: string,
        srcPath: string | Readable,
        destPath: string,
        cb: ExecCallbackWithValue<PushTransfer>
    ): void;
    push(
        serial: string,
        srcPath: string | Readable,
        destPath: string,
        mode: SyncMode,
        cb: ExecCallbackWithValue<PushTransfer>
    ): void;
    push(
        serial: string,
        srcPath: string | Readable,
        destPath: string,
        mode?: ExecCallbackWithValue<PushTransfer> | SyncMode,
        cb?: ExecCallbackWithValue<PushTransfer>
    ): Promise<PushTransfer> | void {
        let mode_: SyncMode;
        if (typeof mode === 'function') {
            cb = mode;
        } else if (typeof mode !== 'undefined') {
            mode_ = mode;
        }

        return nodeify(
            this.syncService(serial).then((sync) => {
                return sync.push(srcPath, destPath, mode_).on('end', () => {
                    sync.end();
                });
            }),
            cb
        );
    }

    tcpip(serial: string): Promise<string>;
    tcpip(serial: string, port: number): Promise<string>;
    tcpip(serial: string, cb: ExecCallbackWithValue<string>): void;
    tcpip(
        serial: string,
        port: number,
        cb: ExecCallbackWithValue<string>
    ): void;
    tcpip(
        serial: string,
        port?: ExecCallbackWithValue<string> | number,
        cb?: ExecCallbackWithValue<string>
    ): Promise<string> | void {
        let port_: number;
        if (typeof port === 'function') {
            cb = port;
        } else if (typeof port !== 'undefined') {
            port_ = port;
        }
        return nodeify(
            this.connection().then((conn) => {
                return new TcpIpCommand(conn).execute(
                    serial,
                    port_,
                    this.options.host
                );
            }),
            cb
        );
    }

    usb(serial: string): Promise<void>;
    usb(serial: string, cb: ExecCallback): void;
    usb(serial: string, cb?: ExecCallback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new UsbCommand(conn).execute(serial);
            }),
            cb
        );
    }

    waitBootComplete(serial: string): Promise<void>;
    waitBootComplete(serial: string, cb: ExecCallback): void;
    waitBootComplete(serial: string, cb?: ExecCallback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new WaitBootCompleteCommand(conn).execute(serial);
            }),
            cb
        );
    }

    waitForDevice(transport: TransportType, state: WaitForState): Promise<void>;
    waitForDevice(
        transport: TransportType,
        state: WaitForState,
        cb?: ExecCallback
    ): void;
    waitForDevice(
        transport: TransportType,
        state: WaitForState,
        cb?: ExecCallback
    ): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new WaitForDeviceCommand(conn).execute(transport, state);
            }),
            cb
        );
    }

    map<R>(mapper: (device: AdbDevice) => R): Promise<R[]> {
        return this.listDevices().then((devices) =>
            devices.map((device) => mapper(new AdbDevice(this, device)))
        );
    }

    private pushInternal(
        serial: string,
        data: string | Readable,
        dest: string
    ): Promise<void> {
        return this.push(serial, data, `${dest}`).then((transfer) => {
            return new Promise((resolve, reject) => {
                transfer.on('end', resolve);
                transfer.on('error', reject);
            });
        });
    }

    pushDataToFile(
        serial: string,
        data: string,
        destPath: string
    ): Promise<void>;
    pushDataToFile(
        serial: string,
        data: string,
        destPath: string,
        cb: ExecCallback
    ): void;
    pushDataToFile(
        serial: string,
        data: string,
        destPath: string,
        cb?: ExecCallback
    ): Promise<void> | void {
        return nodeify(this.pushInternal(serial, data, destPath), cb);
    }

    pushFile(serial: string, srcPath: string, destPath: string): Promise<void>;
    pushFile(
        serial: string,
        srcPath: string,
        destPath: string,
        cb: ExecCallback
    ): void;
    pushFile(
        serial: string,
        srcPath: string,
        destPath: string,
        cb?: ExecCallback
    ): Promise<void> | void {
        return nodeify(this.pushInternal(serial, srcPath, destPath), cb);
    }

    pullDataFromFile(serial: string, srcPath: string): Promise<string>;
    pullDataFromFile(
        serial: string,
        srcPath: string,
        cb: ExecCallbackWithValue<string>
    ): void;
    pullDataFromFile(
        serial: string,
        srcPath: string,
        cb?: ExecCallbackWithValue<string>
    ): Promise<string> | void {
        return nodeify(
            this.pull(serial, `${srcPath}`).then(
                (transfer: PullTransfer): Promise<string> => {
                    return new Promise((resolve, reject) => {
                        let data = '';
                        transfer.on('data', (chunk) => {
                            data += chunk.toString();
                        });
                        transfer.on('end', () => {
                            resolve(data);
                        });
                        transfer.on('error', reject);
                    });
                }
            ),
            cb
        );
    }

    pullFile(serial: string, srcPath: string, destPath: string): Promise<void>;
    pullFile(
        serial: string,
        srcPath: string,
        destPath: string,
        cb: ExecCallback
    ): void;
    pullFile(
        serial: string,
        srcPath: string,
        destPath: string,
        cb?: ExecCallback
    ): Promise<void> | void {
        return nodeify(
            this.pull(serial, `${srcPath}`).then(
                (transfer: PullTransfer): Promise<void> => {
                    return new Promise((resolve, reject) => {
                        // data is piped only when in case there is no error
                        let hadError = false;
                        transfer.once('readable', () => {
                            if (!hadError) {
                                transfer.pipe(fs.createWriteStream(destPath));
                            }
                        });
                        transfer.once('end', resolve);
                        transfer.once('error', (err) => {
                            hadError = true;
                            reject(err);
                        });
                    });
                }
            ),
            cb
        );
    }

    setProp(serial: string, prop: string, value: PrimitiveType): Promise<void>;
    setProp(
        serial: string,
        prop: string,
        value: PrimitiveType,
        cb?: ExecCallback
    ): void;
    setProp(
        serial: string,
        prop: string,
        value: PrimitiveType,
        cb?: ExecCallback
    ): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new SetProp(conn).execute(serial, prop, value)
            ),
            cb
        );
    }

    getProp(serial: string, prop: string): Promise<PrimitiveType>;
    getProp(
        serial: string,
        prop: string,
        cb: ExecCallbackWithValue<PrimitiveType>
    ): void;
    getProp(
        serial: string,
        prop: string,
        cb?: ExecCallbackWithValue<PrimitiveType>
    ): Promise<PrimitiveType> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new GetPropertyCommand(conn).execute(serial, prop);
            }),
            cb
        );
    }

    putSetting(
        serial: string,
        mode: SettingsMode,
        name: string,
        value: PrimitiveType
    ): Promise<void>;
    putSetting(
        serial: string,
        mode: SettingsMode,
        name: string,
        value: PrimitiveType,
        cb: ExecCallback
    ): void;
    putSetting(
        serial: string,
        mode: SettingsMode,
        name: string,
        value: PrimitiveType,
        cb?: ExecCallback
    ): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new PutSetting(conn).execute(serial, mode, name, value);
            }),
            cb
        );
    }

    listSettings(
        serial: string,
        mode: SettingsMode
    ): Promise<PrimitiveDictionary>;
    listSettings(
        serial: string,
        mode: SettingsMode,
        cb: ExecCallbackWithValue<PrimitiveDictionary>
    ): void;
    listSettings(
        serial: string,
        mode: SettingsMode,
        cb?: ExecCallbackWithValue<PrimitiveDictionary>
    ): Promise<PrimitiveDictionary> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new ListSettingsCommand(conn).execute(serial, mode);
            }),
            cb
        );
    }

    getSetting(
        serial: string,
        mode: SettingsMode,
        name: string
    ): Promise<PrimitiveType>;
    getSetting(
        serial: string,
        mode: SettingsMode,
        name: string,
        cb: ExecCallbackWithValue<PrimitiveType>
    ): void;
    getSetting(
        serial: string,
        mode: SettingsMode,
        name: string,
        cb?: ExecCallbackWithValue<PrimitiveType>
    ): Promise<PrimitiveType> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new GetSetting(conn).execute(serial, mode, name);
            }),
            cb
        );
    }

    shell(serial: string, command: string | string[]): Promise<PrimitiveType>;
    shell(
        serial: string,
        command: string | string[],
        cb: ExecCallbackWithValue<PrimitiveType>
    ): void;
    shell(
        serial: string,
        command: string | string[],
        cb?: ExecCallbackWithValue<PrimitiveType>
    ): Promise<PrimitiveType> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new ShellCommand(conn).execute(serial, command);
            }),
            cb
        );
    }

    custom<T>(CustomCommand: CommandConstruct): Promise<T>;
    custom<T>(
        CustomCommand: CommandConstruct,
        cb: ExecCallbackWithValue<T>
    ): void;
    custom<T>(
        CustomCommand: CommandConstruct,
        cb?: ExecCallbackWithValue<T>
    ): Promise<T> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new CustomCommand(conn).execute();
            }),
            cb
        );
    }

    customTransport<T>(
        CustomCommand: CommandConstruct,
        serial: string
    ): Promise<T>;
    customTransport<T>(
        CustomCommand: CommandConstruct,
        serial: string,
        cb: ExecCallbackWithValue<T>
    ): void;
    customTransport<T>(
        CustomCommand: CommandConstruct,
        serial: string,
        cb?: ExecCallbackWithValue<T>
    ): Promise<T> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new CustomCommand(conn).execute(serial);
            }),
            cb
        );
    }

    openMonkey(serial: string): Promise<Monkey>;
    openMonkey(serial: string, cb: ExecCallbackWithValue<Monkey>): void;
    openMonkey(
        serial: string,
        cb?: ExecCallbackWithValue<Monkey>
    ): Promise<Monkey> | void {
        const tryConnect = (times: number): Promise<Monkey> => {
            return this.openTcp(serial, 1080)
                .then((stream) => {
                    return new Monkey().connect(stream);
                })
                .catch((err) => {
                    if ((times -= 1)) {
                        return new Promise((resolve) =>
                            setTimeout(resolve, 100)
                        ).then(() => tryConnect(times));
                    } else {
                        throw err;
                    }
                });
        };
        return nodeify(
            this.transport(serial)
                .then((transport) => {
                    return new MonkeyCommand(transport).execute(serial, 1080);
                })
                .then((out) => {
                    return tryConnect(20).then((monkey) => {
                        return monkey.once('end', () => {
                            return out.end();
                        });
                    });
                }),
            cb
        );
    }

    killApp(serial: string, pkg: string): Promise<void>;
    killApp(serial: string, pkg: string, cb: ExecCallback): void;
    killApp(
        serial: string,
        pkg: string,
        cb?: ExecCallback
    ): Promise<void> | void {
        return nodeify(
            this.shell(serial, `am force-stop ${pkg}`).then(() => {}),
            cb
        );
    }

    private execInternal(...args: ReadonlyArray<string>) {
        return new Promise<string>((resolve, reject) => {
            exec(
                `${this.options.bin} ${args.join(' ')}`,
                (err, stdout, stderr) => {
                    if (err) {
                        return reject(err);
                    }
                    if (stderr) {
                        return reject(new Error(stderr.trim()));
                    }
                    if (/Error/.test(stdout)) {
                        return reject(new Error(stdout.trim()));
                    }
                    return resolve(stdout);
                }
            );
        });
    }

    exec(cmd: string): Promise<string>;
    exec(cmd: string, cb: ExecCallbackWithValue<string>): void;
    exec(
        cmd: string,
        cb?: ExecCallbackWithValue<string>
    ): Promise<string> | void {
        return nodeify(this.execInternal(cmd), cb);
    }

    execDevice(
        serial: string,
        cmd: string,
        cb?: (err: Error, value: string) => void
    ) {
        return this.execInternal(...['-s', serial, cmd]).nodeify(cb);
    }

    execDeviceShell(
        serial: string,
        cmd: string,
        cb?: (err: Error, value: string) => void
    ) {
        return this.execInternal(...['-s', serial, 'shell', cmd]).nodeify(cb);
    }

    batteryStatus(
        serial: string,
        cb?: (err: Error, value: PrimitiveDictionary) => void
    ) {
        return this.connection()
            .then((conn) => {
                return new BatteryStatusCommand(conn).execute(serial);
            })
            .nodeify(cb);
    }

    rm(
        serial: string,
        path: string,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    rm(
        serial: string,
        path: string,
        options?: RmOption,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    rm(
        serial: string,
        path: string,
        options?: any,
        cb?: (err: Error | null, value: string) => void
    ) {
        if (typeof options === 'function' || !options) {
            cb = options;
            options = undefined;
        }
        return this.connection()
            .then((conn) => {
                return new RmCommand(conn).execute(serial, path, options);
            })
            .nodeify(cb);
    }

    mkdir(
        serial: string,
        path: string,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    mkdir(
        serial: string,
        path: string,
        options?: MkDirOptions,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    mkdir(
        serial: string,
        path: string,
        options?: any,
        cb?: (err: Error | null, value: string) => void
    ) {
        if (typeof options === 'function' || !options) {
            cb = options;
            options = undefined;
        }
        return this.connection()
            .then((conn) => {
                return new MkDirCommand(conn).execute(serial, path, options);
            })
            .nodeify(cb);
    }

    touch(
        serial: string,
        path: string,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    touch(
        serial: string,
        path: string,
        options?: TouchOptions,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    touch(
        serial: string,
        path: string,
        options?: any,
        cb?: (err: Error | null, value: string) => void
    ) {
        if (typeof options === 'function' || !options) {
            cb = options;
            options = undefined;
        }
        return this.connection()
            .then((conn) => {
                return new TouchCommand(conn).execute(serial, path, options);
            })
            .nodeify(cb);
    }

    mv(
        serial: string,
        srcPath: string,
        destPath: string,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    mv(
        serial: string,
        srcPath: string,
        destPath: string,
        options?: MvOptions,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    mv(
        serial: string,
        srcPath: string,
        destPath: string,
        options?: any,
        cb?: (err: Error | null, value: string) => void
    ) {
        if (typeof options === 'function' || !options) {
            cb = options;
            options = undefined;
        }
        return this.connection()
            .then((conn) => {
                return new MvCommand(conn).execute(
                    serial,
                    [srcPath, destPath],
                    options
                );
            })
            .nodeify(cb);
    }

    cp(
        serial: string,
        srcPath: string,
        destPath: string,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    cp(
        serial: string,
        srcPath: string,
        destPath: string,
        options?: CpOptions,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    cp(
        serial: string,
        srcPath: string,
        destPath: string,
        options?: any,
        cb?: (err: Error | null, value: string) => void
    ) {
        if (typeof options === 'function' || !options) {
            cb = options;
            options = undefined;
        }
        return this.connection()
            .then((conn) => {
                return new CpCommand(conn).execute(
                    serial,
                    [srcPath, destPath],
                    options
                );
            })
            .nodeify(cb);
    }

    fileStat(
        serial: string,
        path: string,
        cb?: (err: Error | null, value: FileStats) => void
    ) {
        return this.connection().then((conn) => {
            return new FileStatCommand(conn).execute(serial, path).nodeify(cb);
        });
    }
}
