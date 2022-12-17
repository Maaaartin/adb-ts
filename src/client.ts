import {
    AdbClientOptions,
    AdbClientOptionsValues,
    InputDurationOptions,
    ADB_DEFAULT_PORT,
    CommandConstruct,
    CpOptions,
    ExecCallback,
    ExecCallbackWithValue,
    ForwardsObject,
    IAdbDevice,
    InputSource,
    InstallOptions,
    KeyEventOptions,
    LogcatOptions,
    MkDirOptions,
    MvOptions,
    nodeify,
    ReversesObject,
    RmOptions,
    SettingsMode,
    PrimitiveType,
    StartActivityOptions,
    StartServiceOptions,
    TouchOptions,
    UninstallOptions,
    WaitForState,
    parseOptions,
    parsePrimitiveParam,
    parseCbParam,
    parseValueParam,
    IpConnectConstruct,
    PropertyMap,
    buildInputParams,
    NonEmptyArray,
    WaitForType,
    PropertyValue,
    AdbExecError
} from '.';
import Sync, { SyncMode } from './sync';
import { execFile } from 'child_process';
import fs from 'fs';
import AdbDevice from './device';
import BatteryStatusCommand from './commands/host-trasport/baterrystatus';
import ClearCommand from './commands/host-trasport/clear';
import Connect from './commands/host/connect';
import Connection from './connection';
import CpCommand from './commands/host-trasport/cp';
import Disconnect from './commands/host/disconnect';
import FileStatCommand from './commands/host-trasport/filestat';
import FileStat from './filestats';
import ForwardCommand from './commands/host-serial/forward';
import GetDevicePathCommand from './commands/host-serial/getdevicepath';
import GetIpAddressCommand from './commands/host-trasport/ipaddress';
import GetPropertyCommand from './commands/host-trasport/getproperty';
import GetSetting from './commands/host-trasport/getsetting';
import HostTransportCommand from './commands/host/transport';
import InputCommand from './commands/host-trasport/input';
import InstallCommand from './commands/host-trasport/install';
import IsInstalledCommand from './commands/host-trasport/isinstalled';
import { KeyCode } from './keycode';
import KillCommand from './commands/host/kill';
import ListDevicesCommand from './commands/host/listdevices';
import ListFeaturesCommand from './commands/host-trasport/listfeatures';
import ListForwardsCommand from './commands/host-serial/listforwards';
import ListPackagesCommand from './commands/host-trasport/listpackages';
import ListPropertiesCommand from './commands/host-trasport/listproperties';
import ListReversesCommand from './commands/host-trasport/listreverses';
import ListSettingsCommand from './commands/host-trasport/listsettings';
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
import WaitBootCompleteCommand from './commands/host-trasport/waitbootcomplete';
import WaitFor from './commands/host/waitFor';
import { promisify } from 'util';
import T from 'timers/promises';

export default class AdbClient {
    public static readonly defaultOptions: Readonly<AdbClientOptionsValues> =
        Object.freeze({
            port: 5037,
            host: 'localhost',
            bin: 'adb',
            noAutoStart: false
        });
    public readonly options: AdbClientOptionsValues;
    constructor(options?: AdbClientOptions) {
        this.options = Object.entries(options || {})
            .filter(([, value]) => typeof value !== 'undefined')
            .reduce(
                (def, [key, value]) => ({ ...def, [key]: value }),
                AdbClient.defaultOptions
            );
    }

    startServer(): Promise<void>;
    startServer(cb: ExecCallback): void;
    startServer(cb?: ExecCallback): Promise<void> | void {
        const port = this.options.port;
        const args = port
            ? ['-P', port.toString(), 'start-server']
            : ['start-server'];

        return nodeify(
            promisify<void>((cb_) =>
                execFile(this.options.bin, args, (err) => cb_(err))
            )(),
            cb
        );
    }

    private connection(): Promise<Connection> {
        let triedStarting = false;
        const connection = new Connection();
        return new Promise<Connection>((resolve, reject) => {
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
                    connection.destroy();
                    connection.removeAllListeners();
                    return reject(err);
                }
            });
            connection.connect(this.options);
        });
    }

    transport(serial: string): Promise<Connection> {
        return this.connection().then((conn) =>
            new HostTransportCommand(conn).execute(serial).then(() => conn)
        );
    }

    version(): Promise<number>;
    version(cb: ExecCallbackWithValue<number>): void;
    version(cb?: ExecCallbackWithValue<number>): Promise<number> | void {
        return nodeify(
            this.connection().then((conn) =>
                new VersionCommand(conn).execute()
            ),
            cb
        );
    }

    private ipConnect(
        Construct: IpConnectConstruct,
        host: string,
        port: number | string | ExecCallbackWithValue<string> | undefined,
        cb: ExecCallbackWithValue<string> | undefined
    ): Promise<string> | void {
        let port_ = parseValueParam(port);
        if (host.indexOf(':') !== -1) {
            [host, port_] = host.split(':', 2);
        }
        return nodeify(
            this.connection().then((conn) =>
                new Construct(conn).execute(
                    host,
                    parsePrimitiveParam(ADB_DEFAULT_PORT, port_)
                )
            ),
            parseCbParam(port, cb)
        );
    }

    connect(host: string): Promise<string>;
    connect(host: string, port: number | string): Promise<string>;
    connect(host: string, cb: ExecCallbackWithValue<string>): void;
    connect(
        host: string,
        port: number | string,
        cb: ExecCallbackWithValue<string>
    ): void;
    connect(
        host: string,
        port?: number | string | ExecCallbackWithValue<string>,
        cb?: ExecCallbackWithValue<string>
    ): Promise<string> | void {
        return this.ipConnect(Connect, host, port, cb);
    }

    disconnect(host: string): Promise<string>;
    disconnect(host: string, port: number | string): Promise<string>;
    disconnect(host: string, cb: ExecCallbackWithValue<string>): void;
    disconnect(
        host: string,
        port: number | string,
        cb: ExecCallbackWithValue<string>
    ): void;
    disconnect(
        host: string,
        port?: ExecCallbackWithValue<string> | number | string,
        cb?: ExecCallbackWithValue<string>
    ): Promise<string> | void {
        return this.ipConnect(Disconnect, host, port, cb);
    }

    listDevices(): Promise<IAdbDevice[]>;
    listDevices(cb: ExecCallbackWithValue<IAdbDevice[]>): void;
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
    trackDevices(cb: ExecCallbackWithValue<Tracker>): void;
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
    kill(cb: ExecCallback): void;
    kill(cb?: ExecCallback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) => new KillCommand(conn).execute()),
            cb
        );
    }

    getSerialNo(serial: string): Promise<string>;
    getSerialNo(serial: string, cb: ExecCallbackWithValue<string>): void;
    getSerialNo(
        serial: string,
        cb?: ExecCallbackWithValue<string>
    ): Promise<string> | void {
        return cb
            ? this.getProp(serial, 'ro.serialno', (e, v) => cb(e, `${v}`))
            : this.getProp(serial, 'ro.serialno').then((v) => `${v}`);
    }

    /**
     *
     * @param serial
     * @returns {String|'unknown'}
     */
    getDevicePath(serial: string): Promise<string>;
    getDevicePath(serial: string, cb: ExecCallbackWithValue<string>): void;
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

    listProperties(serial: string): Promise<PropertyMap>;
    listProperties(
        serial: string,
        cb: ExecCallbackWithValue<PropertyMap>
    ): void;
    listProperties(
        serial: string,
        cb?: ExecCallbackWithValue<PropertyMap>
    ): Promise<PropertyMap> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ListPropertiesCommand(conn).execute(serial)
            ),
            cb
        );
    }

    listFeatures(serial: string): Promise<PropertyMap>;
    listFeatures(serial: string, cb: ExecCallbackWithValue<PropertyMap>): void;
    listFeatures(
        serial: string,
        cb?: ExecCallbackWithValue<PropertyMap>
    ): Promise<PropertyMap> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ListFeaturesCommand(conn).execute(serial)
            ),
            cb
        );
    }

    listPackages(serial: string): Promise<string[]>;
    listPackages(serial: string, cb: ExecCallbackWithValue<string[]>): void;
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

    getIpAddress(serial: string): Promise<string | string[] | null>;
    getIpAddress(
        serial: string,
        cb: ExecCallbackWithValue<string | string[] | null>
    ): void;
    getIpAddress(
        serial: string,
        cb?: ExecCallbackWithValue<string | string[] | null>
    ): Promise<string | string[] | null> | void {
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
        cb: ExecCallback
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
        cb: ExecCallbackWithValue<ForwardsObject[]>
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
        cb: ExecCallback
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
        cb: ExecCallbackWithValue<ReversesObject[]>
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

    private shellInternal(
        serial: string,
        command: string | string[]
    ): Promise<Connection> {
        return this.connection().then((conn) => {
            return new ShellRawCommand(conn).execute(serial, command);
        });
    }

    reboot(serial: string): Promise<void>;
    reboot(serial: string, cb: ExecCallback): void;
    reboot(serial: string, cb?: ExecCallback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new RebootCommand(conn).execute(serial)
            ),
            cb
        );
    }

    shutdown(serial: string): Promise<void>;
    shutdown(serial: string, cb: ExecCallback): void;
    shutdown(serial: string, cb?: ExecCallback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ShutdownCommand(conn).execute(serial)
            ),
            cb
        );
    }

    remount(serial: string): Promise<void>;
    remount(serial: string, cb: ExecCallback): void;
    remount(serial: string, cb?: ExecCallback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new RemountCommand(conn).execute(serial)
            ),
            cb
        );
    }

    root(serial: string): Promise<void>;
    root(serial: string, cb: ExecCallback): void;
    root(serial: string, cb?: ExecCallback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new RootCommand(conn).execute(serial)
            ),
            cb
        );
    }

    screenshot(serial: string): Promise<Buffer>;
    screenshot(serial: string, cb: ExecCallbackWithValue<Buffer>): void;
    screenshot(
        serial: string,
        cb?: ExecCallbackWithValue<Buffer>
    ): Promise<Buffer> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new ScreenShotCommand(conn).execute(serial);
            }),
            cb
        );
    }

    openTcp(serial: string, port: number | string): Promise<Connection>;
    openTcp(
        serial: string,
        port: number | string,
        host: string
    ): Promise<Connection>;
    openTcp(
        serial: string,
        port: number | string,
        cb: ExecCallbackWithValue<Connection>
    ): void;
    openTcp(
        serial: string,
        port: number | string,
        host: string,
        cb: ExecCallbackWithValue<Connection>
    ): void;
    openTcp(
        serial: string,
        port: number | string,
        host?: string | ExecCallbackWithValue<Connection>,
        cb?: ExecCallbackWithValue<Connection>
    ): Promise<Connection> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new TcpCommand(conn).execute(
                    serial,
                    port,
                    parseValueParam(host)
                );
            }),
            parseCbParam(host, cb)
        );
    }

    roll(serial: string, x: number, y: number): Promise<void>;
    roll(
        serial: string,
        x: number,
        y: number,
        source: InputSource
    ): Promise<void>;
    roll(serial: string, x: number, y: number, cb: ExecCallback): void;
    roll(
        serial: string,
        x: number,
        y: number,
        source: InputSource,
        cb: ExecCallback
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
        options: InputDurationOptions
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
        options: InputDurationOptions,
        cb: ExecCallback
    ): void;
    dragAndDrop(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: InputDurationOptions | ExecCallback,
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
                    typeof options === 'object' ? options.duration : ''
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
        options: InputDurationOptions
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
        options: InputDurationOptions,
        cb: ExecCallback
    ): void;
    swipe(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: InputDurationOptions | ExecCallback,
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
                    typeof options === 'object' ? options.duration : ''
                );
            }),
            _cb
        );
    }
    // TODO add display id
    keyEvent(
        serial: string,
        code: KeyCode | NonEmptyArray<KeyCode>
    ): Promise<void>;
    keyEvent(
        serial: string,
        code: number | NonEmptyArray<number>
    ): Promise<void>;

    keyEvent(
        serial: string,
        code: KeyCode | NonEmptyArray<KeyCode>,
        options: KeyEventOptions
    ): Promise<void>;
    keyEvent(
        serial: string,
        code: number | NonEmptyArray<number>,
        options: KeyEventOptions
    ): Promise<void>;

    keyEvent(
        serial: string,
        code: KeyCode | NonEmptyArray<KeyCode>,
        cb: ExecCallback
    ): void;
    keyEvent(
        serial: string,
        code: number | NonEmptyArray<number>,
        cb: ExecCallback
    ): void;

    keyEvent(
        serial: string,
        code: KeyCode | NonEmptyArray<KeyCode>,
        options: KeyEventOptions,
        cb: ExecCallback
    ): void;
    keyEvent(
        serial: string,
        code: number | NonEmptyArray<number>,
        options: KeyEventOptions,
        cb: ExecCallback
    ): void;

    keyEvent(
        serial: string,
        code: number | NonEmptyArray<number>,
        options?: KeyEventOptions | ExecCallback,
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
                    _source,
                    'keyevent',
                    typeof options === 'object'
                        ? options.variant === 'longpress'
                            ? '--longpress'
                            : options.variant === 'doubletap'
                            ? '--doubletap'
                            : ''
                        : '',
                    ...(Array.isArray(code) ? code : [code])
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
    text(serial: string, text: string, cb: ExecCallback): void;
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
                return new InputCommand(conn)
                    .withEscape()
                    .execute(serial, _source, 'text', text);
            }),
            _cb
        );
    }

    // manual test
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
                return new LogcatCommand(conn).execute(
                    serial,
                    typeof options === 'object' ? options : undefined
                );
            }),
            cb
        );
    }

    private syncService(serial: string): Promise<Sync> {
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

    // manual test
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
            args_ = '';
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
                let endListener: () => void;
                return new Promise<void>((resolve, reject) => {
                    transfer.once(
                        'error',
                        (errorListener = (err): void => {
                            reject(err);
                        })
                    );
                    transfer.once(
                        'end',
                        (endListener = (): void => {
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
    uninstall(
        serial: string,
        pkg: string,
        options: UninstallOptions
    ): Promise<void>;
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

    tcpip(serial: string): Promise<void>;
    tcpip(serial: string, port: number): Promise<void>;
    tcpip(serial: string, cb: ExecCallback): void;
    tcpip(serial: string, port: number, cb: ExecCallback): void;
    tcpip(
        serial: string,
        port?: ExecCallback | number,
        cb?: ExecCallback
    ): Promise<void> | void {
        let port_ = 5555;
        if (typeof port === 'function') {
            cb = port;
        } else if (typeof port === 'number') {
            port_ = port;
        }

        return nodeify(
            this.connection().then((conn) => {
                return new TcpIpCommand(conn).execute(serial, port_);
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

    waitFor(transport: WaitForType, state: WaitForState): Promise<void>;
    waitFor(
        transport: WaitForType,
        state: WaitForState,
        cb?: ExecCallback
    ): void;
    waitFor(
        transport: WaitForType,
        state: WaitForState,
        cb?: ExecCallback
    ): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new WaitFor(conn).execute(transport, state);
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
        data: string | Buffer | Readable,
        destPath: string
    ): Promise<void>;
    pushDataToFile(
        serial: string,
        data: string | Buffer | Readable,
        destPath: string,
        cb: ExecCallback
    ): void;
    pushDataToFile(
        serial: string,
        data: string | Buffer | Readable,
        destPath: string,
        cb?: ExecCallback
    ): Promise<void> | void {
        return nodeify(
            this.pushInternal(
                serial,
                Readable.from(
                    typeof data === 'string' ? Buffer.from(data, 'utf-8') : data
                ),
                destPath
            ),
            cb
        );
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

    pullDataFromFile(serial: string, srcPath: string): Promise<Buffer>;
    pullDataFromFile(
        serial: string,
        srcPath: string,
        cb: ExecCallbackWithValue<Buffer>
    ): void;
    pullDataFromFile(
        serial: string,
        srcPath: string,
        cb?: ExecCallbackWithValue<Buffer>
    ): Promise<Buffer> | void {
        return nodeify(
            this.pull(serial, `${srcPath}`).then(
                (transfer: PullTransfer): Promise<Buffer> => {
                    return new Promise((resolve, reject) => {
                        let data = Buffer.alloc(0);
                        transfer.on('data', (chunk) => {
                            data = Buffer.concat([data, chunk]);
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
            this.pull(serial, srcPath).then(
                (transfer: PullTransfer): Promise<void> => {
                    return new Promise((resolve, reject) => {
                        transfer.once('readable', () => {
                            transfer.pipe(fs.createWriteStream(destPath));
                        });
                        transfer.once('end', () => {
                            transfer.removeAllListeners('readable');
                            resolve();
                        });
                        transfer.once('error', (err) => {
                            transfer.removeAllListeners('readable');
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

    getProp(serial: string, prop: string): Promise<PropertyValue>;
    getProp(
        serial: string,
        prop: string,
        cb: ExecCallbackWithValue<PropertyValue>
    ): void;
    getProp(
        serial: string,
        prop: string,
        cb?: ExecCallbackWithValue<PropertyValue>
    ): Promise<PropertyValue> | void {
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

    listSettings(serial: string, mode: SettingsMode): Promise<PropertyMap>;
    listSettings(
        serial: string,
        mode: SettingsMode,
        cb: ExecCallbackWithValue<PropertyMap>
    ): void;
    listSettings(
        serial: string,
        mode: SettingsMode,
        cb?: ExecCallbackWithValue<PropertyMap>
    ): Promise<PropertyMap> | void {
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
    ): Promise<PropertyValue>;
    getSetting(
        serial: string,
        mode: SettingsMode,
        name: string,
        cb: ExecCallbackWithValue<PropertyValue>
    ): void;
    getSetting(
        serial: string,
        mode: SettingsMode,
        name: string,
        cb?: ExecCallbackWithValue<PropertyValue>
    ): Promise<PropertyValue> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new GetSetting(conn).execute(serial, mode, name);
            }),
            cb
        );
    }

    shell(serial: string, command: string): Promise<string>;
    shell(
        serial: string,
        command: string,
        cb: ExecCallbackWithValue<string>
    ): void;
    shell(
        serial: string,
        command: string,
        cb?: ExecCallbackWithValue<string>
    ): Promise<string> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new ShellCommand(conn).execute(serial, command);
            }),
            cb
        );
    }

    // TODO remove?
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
                        return T.setTimeout(100).then(() => tryConnect(times));
                    }
                    throw err;
                });
        };

        const establishConnection = (attempts: number): Promise<Monkey> => {
            const tryConnectHandler = (
                conn: Connection,
                monkey: Monkey
            ): Promise<Monkey> => {
                return T.setTimeout(100).then(() => {
                    const hookMonkey = (): Promise<Monkey> => {
                        return Promise.resolve(
                            monkey.once('end', () => {
                                return conn.end();
                            })
                        );
                    };
                    if (monkey.stream.readyState === 'closed') {
                        conn.end();

                        // if attempts fail, return monkey anyway
                        return attempts === 0
                            ? hookMonkey()
                            : establishConnection(attempts - 1);
                    }
                    return hookMonkey();
                });
            };
            return this.transport(serial)
                .then((transport) => {
                    return new MonkeyCommand(transport).execute(serial, 1080);
                })
                .then((conn) => {
                    return tryConnect(20).then(
                        (monkey) => {
                            return tryConnectHandler(conn, monkey);
                        },
                        (err) => {
                            conn.end();
                            throw err;
                        }
                    );
                });
        };
        return nodeify(establishConnection(3), cb);
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

    private execInternal(...args: ReadonlyArray<string>): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            execFile(this.options.bin, args, (err, stdout, stderr) => {
                if (err) {
                    return reject(err);
                }
                if (stderr && !stdout) {
                    return reject(
                        new AdbExecError(stderr.trim(), args.join(' '))
                    );
                }
                if (/Error/.test(stdout)) {
                    return reject(
                        new AdbExecError(stdout.trim(), args.join(' '))
                    );
                }
                return resolve(stdout);
            });
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

    execDevice(serial: string, cmd: string): Promise<string>;
    execDevice(
        serial: string,
        cmd: string,
        cb: ExecCallbackWithValue<string>
    ): void;
    execDevice(
        serial: string,
        cmd: string,
        cb?: ExecCallbackWithValue<string>
    ): Promise<string> | void {
        return nodeify(this.execInternal(...['-s', serial, cmd]), cb);
    }

    execDeviceShell(serial: string, cmd: string): Promise<string>;
    execDeviceShell(
        serial: string,
        cmd: string,
        cb: ExecCallbackWithValue<string>
    ): void;
    execDeviceShell(
        serial: string,
        cmd: string,
        cb?: ExecCallbackWithValue<string>
    ): Promise<string> | void {
        return nodeify(this.execInternal(...['-s', serial, 'shell', cmd]), cb);
    }

    batteryStatus(serial: string): Promise<PropertyMap>;
    batteryStatus(serial: string, cb: ExecCallbackWithValue<PropertyMap>): void;
    batteryStatus(
        serial: string,
        cb?: ExecCallbackWithValue<PropertyMap>
    ): Promise<PropertyMap> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new BatteryStatusCommand(conn).execute(serial);
            }),
            cb
        );
    }

    rm(serial: string, path: string): Promise<void>;
    rm(serial: string, path: string, options: RmOptions): Promise<void>;
    rm(serial: string, path: string, cb: ExecCallback): void;
    rm(
        serial: string,
        path: string,
        options: RmOptions,
        cb: ExecCallback
    ): void;
    rm(
        serial: string,
        path: string,
        options?: RmOptions | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        if (typeof options === 'function' || !options) {
            cb = options;
            options = undefined;
        }
        const options_: RmOptions | undefined = options;

        return nodeify(
            this.connection().then((conn) => {
                return new RmCommand(conn).execute(serial, path, options_);
            }),
            cb
        );
    }

    mkdir(serial: string, path: string): Promise<void>;
    mkdir(serial: string, path: string, options?: MkDirOptions): Promise<void>;
    mkdir(serial: string, path: string, cb: ExecCallback): void;
    mkdir(
        serial: string,
        path: string,
        options: MkDirOptions,
        cb: ExecCallback
    ): void;
    mkdir(
        serial: string,
        path: string,
        options?: MkDirOptions | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        if (typeof options === 'function' || !options) {
            cb = options;
            options = undefined;
        }
        const options_: MkDirOptions | undefined = options;
        return nodeify(
            this.connection().then((conn) => {
                return new MkDirCommand(conn).execute(serial, path, options_);
            }),
            cb
        );
    }

    touch(serial: string, path: string): Promise<void>;
    touch(serial: string, path: string, options: TouchOptions): Promise<void>;
    touch(serial: string, path: string, cb: ExecCallback): void;
    touch(
        serial: string,
        path: string,
        options: TouchOptions,
        cb: ExecCallback
    ): void;
    touch(
        serial: string,
        path: string,
        options?: TouchOptions | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        if (typeof options === 'function' || !options) {
            cb = options;
            options = undefined;
        }
        return nodeify(
            this.connection().then((conn) => {
                return new TouchCommand(conn).execute(
                    serial,
                    path,
                    parseOptions(options)
                );
            }),
            cb
        );
    }

    mv(serial: string, srcPath: string, destPath: string): Promise<void>;
    mv(
        serial: string,
        srcPath: string,
        destPath: string,
        options: MvOptions
    ): Promise<void>;
    mv(
        serial: string,
        srcPath: string,
        destPath: string,
        cb: ExecCallback
    ): void;
    mv(
        serial: string,
        srcPath: string,
        destPath: string,
        options: MvOptions,
        cb: ExecCallback
    ): void;
    mv(
        serial: string,
        srcPath: string,
        destPath: string,
        options?: ExecCallback | MvOptions,
        cb?: ExecCallback
    ): Promise<void> | void {
        if (typeof options === 'function' || !options) {
            cb = options;
            options = undefined;
        }

        return nodeify(
            this.connection().then((conn) => {
                return new MvCommand(conn).execute(
                    serial,
                    [srcPath, destPath],
                    parseOptions(options)
                );
            }),
            cb
        );
    }

    cp(serial: string, srcPath: string, destPath: string): Promise<void>;
    cp(
        serial: string,
        srcPath: string,
        destPath: string,
        options: CpOptions
    ): Promise<void>;
    cp(
        serial: string,
        srcPath: string,
        destPath: string,
        cb: ExecCallback
    ): void;
    cp(
        serial: string,
        srcPath: string,
        destPath: string,
        options: CpOptions,
        cb: ExecCallback
    ): void;
    cp(
        serial: string,
        srcPath: string,
        destPath: string,
        options?: ExecCallback | CpOptions,
        cb?: ExecCallback
    ): Promise<void> | void {
        if (typeof options === 'function' || !options) {
            cb = options;
            options = undefined;
        }
        return nodeify(
            this.connection().then((conn) => {
                return new CpCommand(conn).execute(
                    serial,
                    [srcPath, destPath],
                    parseOptions(options)
                );
            }),
            cb
        );
    }

    fileStat(serial: string, path: string): Promise<FileStat>;
    fileStat(
        serial: string,
        path: string,
        cb: ExecCallbackWithValue<FileStat>
    ): void;
    fileStat(
        serial: string,
        path: string,
        cb?: ExecCallbackWithValue<FileStat>
    ): Promise<FileStat> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new FileStatCommand(conn).execute(serial, path);
            }),
            cb
        );
    }
}
