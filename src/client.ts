import {
    AdbClientOptions,
    AdbClientOptionsValues,
    InputDurationOptions,
    CommandConstruct,
    CpOptions,
    Callback,
    ValueCallback,
    ForwardsObject,
    IDevice,
    InputSource,
    InstallOptions,
    KeyEventOptions,
    LogcatOptions,
    MkDirOptions,
    MvOptions,
    ReversesObject,
    RmOptions,
    SettingsMode,
    PrimitiveType,
    StartActivityOptions,
    StartServiceOptions,
    TouchOptions,
    UninstallOptions,
    WaitForState,
    IpConnectConstruct,
    PropertyMap,
    NonEmptyArray,
    WaitForType,
    PropertyValue,
    TransportCommandConstruct
} from './util';
import {
    parseOptions,
    parsePrimitiveParam,
    parseCbParam,
    buildInputParams,
    parseValueParam,
    nodeify
} from './util';
import { AdbExecError } from './util';
import { Sync, SyncMode } from './sync';
import { execFile } from 'child_process';
import fs from 'fs';
import { Device } from './device';
import BatteryStatusCommand from './commands/host-trasport/baterrystatus';
import ClearCommand from './commands/host-trasport/clear';
import Connect from './commands/host/connect';
import { Connection } from './connection';
import CpCommand from './commands/host-trasport/cp';
import Disconnect from './commands/host/disconnect';
import FileStatCommand from './commands/host-trasport/filestat';
import { FileStat } from './filestats';
import ForwardCommand from './commands/host-serial/forward';
import GetDevicePathCommand from './commands/host-serial/getdevicepath';
import GetIpAddressCommand from './commands/host-trasport/ipaddress';
import GetPropertyCommand from './commands/host-trasport/getproperty';
import GetSetting from './commands/host-trasport/getsetting';
import HostTransportCommand from './commands/host/transport';
import InputCommand from './commands/host-trasport/input';
import InstallCommand from './commands/host-trasport/install';
import IsInstalledCommand from './commands/host-trasport/isinstalled';
import { KeyCode } from './util/keycode';
import KillCommand from './commands/host/kill';
import ListDevicesCommand from './commands/host/listdevices';
import ListFeaturesCommand from './commands/host-trasport/listfeatures';
import ListForwardsCommand from './commands/host-serial/listforwards';
import ListPackagesCommand from './commands/host-trasport/listpackages';
import ListPropertiesCommand from './commands/host-trasport/listproperties';
import ListReversesCommand from './commands/host-trasport/listreverses';
import ListSettingsCommand from './commands/host-trasport/listsettings';
import LogcatCommand from './commands/host-trasport/logcat';
import { LogcatReader } from './logcat/reader';
import MkDirCommand from './commands/host-trasport/mkdir';
import { Monkey } from './monkey/client';
import MonkeyCommand from './commands/host-trasport/monkey';
import MvCommand from './commands/host-trasport/mv';
import { Parser } from './parser';
import { PullTransfer } from './sync/pulltransfer';
import { PushTransfer } from './sync/pushtransfer';
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
import { Tracker } from './tracker';
import UninstallCommand from './commands/host-trasport/uninstall';
import UsbCommand from './commands/host-trasport/usb';
import VersionCommand from './commands/host/version';
import WaitBootCompleteCommand from './commands/host-trasport/waitbootcomplete';
import WaitFor from './commands/host/waitFor';
import { promisify } from 'util';
import T from 'timers/promises';

const ADB_DEFAULT_PORT = 5555;
const DEFAULT_OPTIONS: Readonly<AdbClientOptionsValues> = Object.freeze({
    port: 5037,
    host: 'localhost',
    bin: 'adb',
    noAutoStart: false
});

export class Client {
    private options: AdbClientOptionsValues;

    /**
     * @param {AdbClientOptions} options see AdbClientOptions for more details
     */
    constructor(options?: AdbClientOptions) {
        this.options = Object.entries(options || {})
            .filter(([, value]) => typeof value !== 'undefined')
            .reduce(
                (def, [key, value]) => ({ ...def, [key]: value }),
                DEFAULT_OPTIONS
            );
    }

    /**
     * Starts adb server if not running.
     */
    startServer(): Promise<void>;
    startServer(cb: Callback): void;
    startServer(cb?: Callback): Promise<void> | void {
        const port = this.options.port;
        const args = ['-P', port.toString(), 'start-server'];
        return nodeify(
            promisify<void>((cb_) =>
                execFile(this.options.bin, args, (err) => cb_(err))
            )(),
            cb
        );
    }

    private connection(): Promise<Connection> {
        return new Promise<Connection>((resolve, reject) => {
            let triedStarting = false;
            const connection = new Connection();
            connection.once('connect', () => {
                return resolve(connection);
            });
            connection.on('error', (err: Error) => {
                if (
                    (err as Record<string, any>).code === 'ECONNREFUSED' &&
                    !triedStarting &&
                    !this.options.noAutoStart
                ) {
                    triedStarting = true;
                    return this.startServer().then(() =>
                        connection.connect(this.options)
                    );
                }
                connection.destroy();
                connection.removeAllListeners();
                return reject(err);
            });
            connection.connect(this.options);
        });
    }

    transport(serial: string): Promise<Connection> {
        return this.connection().then((conn) =>
            new HostTransportCommand(conn).execute(serial).then(() => conn)
        );
    }

    /**
     * Gets the adb server version.
     */
    version(): Promise<number>;
    version(cb: ValueCallback<number>): void;
    version(cb?: ValueCallback<number>): Promise<number> | void {
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
        port: number | ValueCallback<string> | undefined,
        cb: ValueCallback<string> | undefined
    ): Promise<string> | void {
        let port_ = parseValueParam(port);
        if (host.indexOf(':') !== -1) {
            const [h, p] = host.split(':', 2);
            host = h;
            port_ = parseInt(p);
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

    /**
     * Connects to device over local network.
     * @example
     * adb.map(async (device) => {
     *    await device.tcpip();
     *    await adb.waitFor('usb', 'device');
     *    const ip = await device.getIpAddress();
     *    await adb.connect(ip);
     *});
     */
    connect(host: string): Promise<string>;
    connect(host: string, port: number): Promise<string>;
    connect(host: string, cb: ValueCallback<string>): void;
    connect(host: string, port: number, cb: ValueCallback<string>): void;
    connect(
        host: string,
        port?: number | ValueCallback<string>,
        cb?: ValueCallback<string>
    ): Promise<string> | void {
        return this.ipConnect(Connect, host, port, cb);
    }

    /**
     * Disconnects from the given device.
     */
    disconnect(host: string): Promise<string>;
    disconnect(host: string, port: number): Promise<string>;
    disconnect(host: string, cb: ValueCallback<string>): void;
    disconnect(host: string, port: number, cb: ValueCallback<string>): void;
    disconnect(
        host: string,
        port?: ValueCallback<string> | number,
        cb?: ValueCallback<string>
    ): Promise<string> | void {
        return this.ipConnect(Disconnect, host, port, cb);
    }

    /**
     * Gets the list of currently connected devices and emulators.
     */
    listDevices(): Promise<IDevice[]>;
    listDevices(cb: ValueCallback<IDevice[]>): void;
    listDevices(cb?: ValueCallback<IDevice[]>): Promise<IDevice[]> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ListDevicesCommand(conn).execute()
            ),
            cb
        );
    }

    /**
     * Tracks connection status of devices.
     */
    trackDevices(): Promise<Tracker>;
    trackDevices(cb: ValueCallback<Tracker>): void;
    trackDevices(cb?: ValueCallback<Tracker>): Promise<Tracker> | void {
        return nodeify(
            this.connection().then((conn) => {
                const command = new TrackCommand(conn);
                return command.execute().then(() => new Tracker(command, this));
            }),
            cb
        );
    }

    /**
     * Kills the adb server.
     */
    kill(): Promise<void>;
    kill(cb: Callback): void;
    kill(cb?: Callback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) => new KillCommand(conn).execute()),
            cb
        );
    }

    /**
     * Gets the serial number of the device.
     * Meant for getting serial number of local devices.
     * Analogous to `adb shell getprop ro.serialno`.
     */
    getSerialNo(serial: string): Promise<string>;
    getSerialNo(serial: string, cb: ValueCallback<string>): void;
    getSerialNo(
        serial: string,
        cb?: ValueCallback<string>
    ): Promise<string> | void {
        return cb
            ? this.getProp(serial, 'ro.serialno', (e, v) => cb(e, `${v}`))
            : this.getProp(serial, 'ro.serialno').then((v) => `${v}`);
    }

    /**
     * Gets the device path of the device identified by the device.
     */
    getDevicePath(serial: string): Promise<string>;
    getDevicePath(serial: string, cb: ValueCallback<string>): void;
    getDevicePath(
        serial: string,
        cb?: ValueCallback<string>
    ): Promise<string> | void {
        return nodeify(
            this.connection().then((conn) =>
                new GetDevicePathCommand(conn).execute(serial)
            ),
            cb
        );
    }

    /**
     * Lists properties of the device.
     * Analogous to `adb shell getprop`.
     */
    listProperties(serial: string): Promise<PropertyMap>;
    listProperties(serial: string, cb: ValueCallback<PropertyMap>): void;
    listProperties(
        serial: string,
        cb?: ValueCallback<PropertyMap>
    ): Promise<PropertyMap> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ListPropertiesCommand(conn).execute(serial)
            ),
            cb
        );
    }

    /**
     * Lists features of the device.
     * Analogous to `adb shell pm list features`.
     */
    listFeatures(serial: string): Promise<PropertyMap>;
    listFeatures(serial: string, cb: ValueCallback<PropertyMap>): void;
    listFeatures(
        serial: string,
        cb?: ValueCallback<PropertyMap>
    ): Promise<PropertyMap> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ListFeaturesCommand(conn).execute(serial)
            ),
            cb
        );
    }

    /**
     * Lists installed packages.
     * Analogous to `adb shell pm list packages`.
     */
    listPackages(serial: string): Promise<string[]>;
    listPackages(serial: string, cb: ValueCallback<string[]>): void;
    listPackages(
        serial: string,
        cb?: ValueCallback<string[]>
    ): Promise<string[]> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ListPackagesCommand(conn).execute(serial)
            ),
            cb
        );
    }

    /**
     * Gets the ipv4 addresses of default wlan interface.
     */
    getIpAddress(serial: string): Promise<string[]>;
    getIpAddress(serial: string, cb: ValueCallback<string[]>): void;
    getIpAddress(
        serial: string,
        cb?: ValueCallback<string[]>
    ): Promise<string[]> | void {
        return nodeify(
            this.connection().then((conn) =>
                new GetIpAddressCommand(conn).execute(serial)
            ),
            cb
        );
    }

    /**
     * Forwards socket connections from the ADB server host (local) to the device (remote).
     * Analogous to `adb forward <local> <remote>`.
     * @example
     * adb.forward('serial', 'tcp:9222', 'localabstract:chrome_devtools_remote')
     */
    forward(serial: string, local: string, remote: string): Promise<void>;
    forward(serial: string, local: string, remote: string, cb: Callback): void;
    forward(
        serial: string,
        local: string,
        remote: string,
        cb?: Callback
    ): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ForwardCommand(conn).execute(serial, local, remote)
            ),
            cb
        );
    }

    /**
     * Lists all forwarded connections.
     * Analogous to `adb forward --list`.
     */
    listForwards(serial: string): Promise<ForwardsObject[]>;
    listForwards(serial: string, cb: ValueCallback<ForwardsObject[]>): void;
    listForwards(
        serial: string,
        cb?: ValueCallback<ForwardsObject[]>
    ): Promise<ForwardsObject[]> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ListForwardsCommand(conn).execute(serial)
            ),
            cb
        );
    }

    /**
     * Reverses socket connections from the device (remote) to the ADB server host (local).
     * Analogous to `adb reverse <remote> <local>`.
     * @example
     * adb.reverse('serial', 'localabstract:chrome_devtools_remote', 'tcp:9222')
     */
    reverse(serial: string, local: string, remote: string): Promise<void>;
    reverse(serial: string, local: string, remote: string, cb: Callback): void;
    reverse(
        serial: string,
        local: string,
        remote: string,
        cb?: Callback
    ): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ReverseCommand(conn).execute(serial, local, remote)
            ),
            cb
        );
    }

    /**
     * Lists all reversed connections.
     * Analogous to `adb reverse --list`.
     */
    listReverses(serial: string): Promise<ReversesObject[]>;
    listReverses(serial: string, cb: ValueCallback<ReversesObject[]>): void;
    listReverses(
        serial: string,
        cb?: ValueCallback<ReversesObject[]>
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
        command: string | NonEmptyArray<string>
    ): Promise<Connection> {
        return this.connection().then((conn) => {
            return new ShellRawCommand(conn).execute(serial, command);
        });
    }

    /**
     * Reboots the device.
     * Analogous to `adb reboot`.
     */
    reboot(serial: string): Promise<void>;
    reboot(serial: string, cb: Callback): void;
    reboot(serial: string, cb?: Callback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new RebootCommand(conn).execute(serial)
            ),
            cb
        );
    }

    /**
     * Shuts the device down.
     * Analogous to `adb reboot -p`.
     */
    shutdown(serial: string): Promise<void>;
    shutdown(serial: string, cb: Callback): void;
    shutdown(serial: string, cb?: Callback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new ShutdownCommand(conn).execute(serial)
            ),
            cb
        );
    }

    /**
     * Attempts to remount the `/system` partition in read-write mode.
     * Can be done on a rooted device. Analogous to `adb remount`.
     * Analogous to `adb remount`
     */
    remount(serial: string): Promise<void>;
    remount(serial: string, cb: Callback): void;
    remount(serial: string, cb?: Callback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new RemountCommand(conn).execute(serial)
            ),
            cb
        );
    }

    /**
     * Attempts to which the device to the root mode.
     * Analogous to `adb root`.
     */
    root(serial: string): Promise<void>;
    root(serial: string, cb: Callback): void;
    root(serial: string, cb?: Callback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new RootCommand(conn).execute(serial)
            ),
            cb
        );
    }

    /**
     * Takes a screenshot on the specified device.
     * Analogous to `adb shell screencap -p`.
     */
    screenshot(serial: string): Promise<Buffer>;
    screenshot(serial: string, cb: ValueCallback<Buffer>): void;
    screenshot(
        serial: string,
        cb?: ValueCallback<Buffer>
    ): Promise<Buffer> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new ScreenShotCommand(conn).execute(serial);
            }),
            cb
        );
    }

    /**
     * Opens a direct TCP connection to specified port on the device.
     * Analogous to `adb tcp <port>:<host>`.
     * @example
     * const socket = await adb.openTcp('serial', 5555);
     * // socket.write(...)
     */
    openTcp(serial: string, port: number): Promise<Connection>;
    openTcp(serial: string, port: number, host: string): Promise<Connection>;
    openTcp(serial: string, port: number, cb: ValueCallback<Connection>): void;
    openTcp(
        serial: string,
        port: number,
        host: string,
        cb: ValueCallback<Connection>
    ): void;
    openTcp(
        serial: string,
        port: number,
        host?: string | ValueCallback<Connection>,
        cb?: ValueCallback<Connection>
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

    /**
     * Sends roll input command to the device shell.
     * Analogous to `adb shell input trackball roll <x> <y>`.
     * Default input source is `trackball`.
     * @param x Horizontal coordinate.
     * @param y Vertical coordinate.
     */
    roll(serial: string, x: number, y: number): Promise<void>;
    roll(
        serial: string,
        x: number,
        y: number,
        source: InputSource
    ): Promise<void>;
    roll(serial: string, x: number, y: number, cb: Callback): void;
    roll(
        serial: string,
        x: number,
        y: number,
        source: InputSource,
        cb: Callback
    ): void;
    roll(
        serial: string,
        x: number,
        y: number,
        source?: InputSource | Callback,
        cb?: Callback
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

    /**
     * Sends roll input command to the device shell.
     * Analogous to `adb shell input trackball press`.
     * Default input source is `trackball`.
     */
    press(serial: string): Promise<void>;
    press(serial: string, source: InputSource): Promise<void>;
    press(serial: string, cb: Callback): void;
    press(serial: string, source: InputSource, cb: Callback): void;
    press(
        serial: string,
        source?: InputSource | Callback,
        cb?: Callback
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

    /**
     * Sends draganddrop input command to the device shell.
     * Analogous to `adb shell input touchscreen draganddrop x1 y1 x2 y2`.
     * Default input source is `touchscreen`.
     * @param x1 Horizontal starting coordinate.
     * @param y1 Vertical starting coordinate.
     * @param x2 Horizontal ending coordinate.
     * @param y2 Vertical ending coordinate.
     */
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
        cb: Callback
    ): void;
    dragAndDrop(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options: InputDurationOptions,
        cb: Callback
    ): void;
    dragAndDrop(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: InputDurationOptions | Callback,
        cb?: Callback
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

    /**
     * Sends swipe input command to the device shell.
     * Analogous to `adb shell input touchscreen swipe x1 y1 x2 y2`.
     * Default input source is `touchscreen`.
     * @param x1 Horizontal starting coordinate.
     * @param y1 Vertical starting coordinate.
     * @param x2 Horizontal ending coordinate.
     * @param y2 Vertical ending coordinate.
     */
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
        cb: Callback
    ): void;
    swipe(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options: InputDurationOptions,
        cb: Callback
    ): void;
    swipe(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: InputDurationOptions | Callback,
        cb?: Callback
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

    /**
     * Sends keyevent input command to the device shell.
     * Analogous to `adb shell input keyboard keyevent <code>`.
     * Default input source is `keyboard`.
     * @param code Key code to send.
     */
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
        cb: Callback
    ): void;
    keyEvent(
        serial: string,
        code: number | NonEmptyArray<number>,
        cb: Callback
    ): void;

    keyEvent(
        serial: string,
        code: KeyCode | NonEmptyArray<KeyCode>,
        options: KeyEventOptions,
        cb: Callback
    ): void;
    keyEvent(
        serial: string,
        code: number | NonEmptyArray<number>,
        options: KeyEventOptions,
        cb: Callback
    ): void;

    keyEvent(
        serial: string,
        code: number | NonEmptyArray<number>,
        options?: KeyEventOptions | Callback,
        cb?: Callback
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
                    ...[code].flat()
                );
            }),
            _cb
        );
    }

    /**
     * Sends tap input command to the device shell.
     * Analogous to `adb shell input touchscreen tap <x> <y>`.
     * Default input source is `touchscreen`.
     * @param x Horizontal coordinate.
     * @param y Vertical coordinate.
     */
    tap(serial: string, x: number, y: number): Promise<void>;
    tap(
        serial: string,
        x: number,
        y: number,
        source: InputSource
    ): Promise<void>;
    tap(serial: string, x: number, y: number, cb: Callback): void;
    tap(
        serial: string,
        x: number,
        y: number,
        source: InputSource,
        cb: Callback
    ): void;
    tap(
        serial: string,
        x: number,
        y: number,
        source?: InputSource | Callback,
        cb?: Callback
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

    /**
     * Sends text input command to the device shell.
     * Analogous to `adb shell input touchscreen text '<text>'`.
     * Default input source is `touchscreen`.
     */
    text(serial: string, text: string): Promise<void>;
    text(serial: string, text: string, source: InputSource): Promise<void>;
    text(serial: string, text: string, cb: Callback): void;
    text(serial: string, text: string, source: InputSource, cb: Callback): void;
    text(
        serial: string,
        text: string,
        source?: InputSource | Callback,
        cb?: Callback
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

    /**
     * Opens logcat.
     * Analogous to `adb logcat`.
     * @see LogcatReader and LogcatOptions for more details.
     * @example
     * import { Client, Priority } from 'adb-ts';
     * const adb = new Client();
     * const logcat = await adb.openLogcat('serial', {
     *     filter: (entry) => entry.priority > Priority.INFO
     * });
     * logcat.on('entry', (entry) => {
     *     console.log(entry);
     * });
     */
    openLogcat(serial: string): Promise<LogcatReader>;
    openLogcat(serial: string, options: LogcatOptions): Promise<LogcatReader>;
    openLogcat(serial: string, cb: ValueCallback<LogcatReader>): void;
    openLogcat(
        serial: string,
        options: LogcatOptions,
        cb: ValueCallback<LogcatReader>
    ): void;
    openLogcat(
        serial: string,
        options?: ValueCallback<LogcatReader> | LogcatOptions,
        cb?: ValueCallback<LogcatReader>
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

    /**
     * Deletes all data associated with a package from the device.
     * Analogous to `adb shell pm clear <pkg>`.
     */
    clear(serial: string, pkg: string): Promise<void>;
    clear(serial: string, pkg: string, cb: Callback): void;
    clear(serial: string, pkg: string, cb?: Callback): Promise<void> | void {
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
                            return new Parser(stream)
                                .readAll()
                                .then(() => {})
                                .finally(() => {
                                    stream.end();
                                });
                        }
                    );
                });
        });
    }

    /**
     * Installs an apk to the device.
     * Analogous to `adb install <pkg>`.
     */
    install(serial: string, apk: string | Readable): Promise<void>;
    install(
        serial: string,
        apk: string | Readable,
        options: InstallOptions
    ): Promise<void>;
    /**
     * @param args Extra arguments. E.g. `--fastdeploy` flag.
     */
    install(
        serial: string,
        apk: string | Readable,
        options: InstallOptions,
        args: string
    ): Promise<void>;
    install(serial: string, apk: string | Readable, cb: Callback): void;
    install(
        serial: string,
        apk: string | Readable,
        options: InstallOptions,
        cb: Callback
    ): void;
    install(
        serial: string,
        apk: string | Readable,
        options: InstallOptions,
        args: string,
        cb: Callback
    ): void;

    install(
        serial: string,
        apk: string | Readable,
        options?: InstallOptions | Callback,
        args?: string | Callback,
        cb?: Callback
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
                    transfer.removeListener('end', endListener);
                });
            }),
            cb
        );
    }

    /**
     * Uninstalls a package from the device.
     * Analogous to `adb uninstall`.
     */
    uninstall(serial: string, pkg: string): Promise<void>;
    uninstall(
        serial: string,
        pkg: string,
        options: UninstallOptions
    ): Promise<void>;
    uninstall(serial: string, pkg: string, cb: Callback): void;
    uninstall(
        serial: string,
        pkg: string,
        options: UninstallOptions,
        cb: Callback
    ): void;
    uninstall(
        serial: string,
        pkg: string,
        options?: Callback | UninstallOptions,
        cb?: Callback
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

    /**
     * Tells if a package is installed or not.
     */
    isInstalled(serial: string, pkg: string): Promise<boolean>;
    isInstalled(serial: string, pkg: string, cb: ValueCallback<boolean>): void;
    isInstalled(
        serial: string,
        pkg: string,
        cb?: ValueCallback<boolean>
    ): Promise<boolean> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new IsInstalledCommand(conn).execute(serial, pkg);
            }),
            cb
        );
    }

    /**
     * Starts a new activity with options.
     * Analogous to `adb shell am start <pkg./activity>`.
     */
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
        cb: Callback
    ): void;
    startActivity(
        serial: string,
        pkg: string,
        activity: string,
        options: StartActivityOptions,
        cb: Callback
    ): void;
    startActivity(
        serial: string,
        pkg: string,
        activity: string,
        options?: StartActivityOptions | Callback,
        cb?: Callback
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

    /**
     * Starts a new service with options.
     * Analogous to `adb shell am startservice <pkg> <service>`.
     */
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
        cb: Callback
    ): void;
    startService(
        serial: string,
        pkg: string,
        service: string,
        options: StartServiceOptions,
        cb: Callback
    ): void;
    startService(
        serial: string,
        pkg: string,
        service: string,
        options?: StartServiceOptions | Callback,
        cb?: Callback
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

    /**
     * Reads given directory.
     * The path should start with `/`.
     */
    readDir(serial: string, path: string): Promise<SyncEntry[]>;
    readDir(serial: string, path: string, cb: ValueCallback<SyncEntry[]>): void;
    readDir(
        serial: string,
        path: string,
        cb?: ValueCallback<SyncEntry[]>
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

    /**
     * Gets a PullTransfer instance.
     * @see PullTransfer
     * @example
     * let data = '';
     * const transfer = await adb.pull('serial', '/path')
     * transfer.on('data', (chunk) => {
     *     data += chunk.toString();
     * });
     * transfer.on('end', () => {
     *     console.log(data);
     * });
     */
    pull(serial: string, path: string): Promise<PullTransfer>;
    pull(serial: string, path: string, cb: ValueCallback<PullTransfer>): void;

    pull(
        serial: string,
        path: string,
        cb?: ValueCallback<PullTransfer>
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

    /**
     * Gets a PushTransfer instance.
     * @see PushTransfer
     * @example
     * const transfer = await adb.push('serial', '/path-src', '/path-dest')
     * transfer.on('end', () => { });
     */
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
        cb: ValueCallback<PushTransfer>
    ): void;
    push(
        serial: string,
        srcPath: string | Readable,
        destPath: string,
        mode: SyncMode,
        cb: ValueCallback<PushTransfer>
    ): void;
    push(
        serial: string,
        srcPath: string | Readable,
        destPath: string,
        mode?: ValueCallback<PushTransfer> | SyncMode,
        cb?: ValueCallback<PushTransfer>
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

    private awaitActiveDevice(serial: string): Promise<void> {
        const track = (tracker: Tracker): Promise<void> => {
            return new Promise<void>((resolve, reject) => {
                const activeDeviceListener = (device: IDevice): void => {
                    if (
                        device.id === serial &&
                        (device.state === 'device' ||
                            device.state === 'emulator')
                    ) {
                        resolve();
                    }
                };
                tracker.once('error', reject);
                tracker.once('remove', (device) => {
                    if (device.id === serial) {
                        tracker.on('add', activeDeviceListener);
                        tracker.on('change', activeDeviceListener);
                    }
                });
            });
        };
        return this.trackDevices().then((tracker) => {
            return Promise.race([
                T.setTimeout(5000, undefined, { ref: false }),
                track(tracker)
            ]).finally(() => tracker.end());
        });
    }

    /**
     * Puts the device ADB daemon into tcp mode.
     * Afterwards it is possible to use `connect` method.
     * Analogous to `adb tcpip 5555`.
     */
    tcpip(serial: string): Promise<void>;
    tcpip(serial: string, port: number): Promise<void>;
    tcpip(serial: string, cb: Callback): void;
    tcpip(serial: string, port: number, cb: Callback): void;
    tcpip(
        serial: string,
        port?: Callback | number,
        cb?: Callback
    ): Promise<void> | void {
        let port_ = 5555;
        if (typeof port === 'function') {
            cb = port;
        } else if (typeof port === 'number') {
            port_ = port;
        }

        return nodeify(
            this.connection().then((conn) => {
                return new TcpIpCommand(
                    conn,
                    this.awaitActiveDevice(serial)
                ).execute(serial, port_);
            }),
            cb
        );
    }

    /**
     * Sets the device transport back to usb.
     */
    usb(serial: string): Promise<void>;
    usb(serial: string, cb: Callback): void;
    usb(serial: string, cb?: Callback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new UsbCommand(
                    conn,
                    this.awaitActiveDevice(serial)
                ).execute(serial);
            }),
            cb
        );
    }

    /**
     * Waits until the device has finished booting.
     */
    waitBootComplete(serial: string): Promise<void>;
    waitBootComplete(serial: string, cb: Callback): void;
    waitBootComplete(serial: string, cb?: Callback): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new WaitBootCompleteCommand(conn).execute(serial);
            }),
            cb
        );
    }

    /**
     * Waits until the device is in the given state.
     * Analogous to `adb wait-for-<transport>-<state>`.
     */
    waitFor(transport: WaitForType, state: WaitForState): Promise<void>;
    waitFor(transport: WaitForType, state: WaitForState, cb?: Callback): void;
    waitFor(
        transport: WaitForType,
        state: WaitForState,
        cb?: Callback
    ): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new WaitFor(conn).execute(transport, state);
            }),
            cb
        );
    }

    /**
     * Maps through all connected devices.
     */
    map<T>(mapper: (device: Device) => T): Promise<T[]> {
        return this.listDevices().then((devices) =>
            devices.map((device) => mapper(new Device(this, device)))
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

    /**
     * Wraps {@link push} method, provides API for quick data writing.
     */
    pushDataToFile(
        serial: string,
        data: string | Buffer | Readable,
        destPath: string
    ): Promise<void>;
    pushDataToFile(
        serial: string,
        data: string | Buffer | Readable,
        destPath: string,
        cb: Callback
    ): void;
    pushDataToFile(
        serial: string,
        data: string | Buffer | Readable,
        destPath: string,
        cb?: Callback
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

    /**
     * Wraps {@link push} method, reads the content of file on the host to a file on the device.
     */
    pushFile(serial: string, srcPath: string, destPath: string): Promise<void>;
    pushFile(
        serial: string,
        srcPath: string,
        destPath: string,
        cb: Callback
    ): void;
    pushFile(
        serial: string,
        srcPath: string,
        destPath: string,
        cb?: Callback
    ): Promise<void> | void {
        return nodeify(this.pushInternal(serial, srcPath, destPath), cb);
    }

    /**
     * Wraps {@link pull} method, reads the file content and resolves with the output.
     */
    pullDataFromFile(serial: string, srcPath: string): Promise<Buffer>;
    pullDataFromFile(
        serial: string,
        srcPath: string,
        cb: ValueCallback<Buffer>
    ): void;
    pullDataFromFile(
        serial: string,
        srcPath: string,
        cb?: ValueCallback<Buffer>
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

    /**
     * Wraps {@link pull} method, reads the content of file on the device and write it to a file on the machine.
     */
    pullFile(serial: string, srcPath: string, destPath: string): Promise<void>;
    pullFile(
        serial: string,
        srcPath: string,
        destPath: string,
        cb: Callback
    ): void;
    pullFile(
        serial: string,
        srcPath: string,
        destPath: string,
        cb?: Callback
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

    /**
     * Sets property on the device.
     * Analogues to `adb shell setprop <prop> <value>`.
     */
    setProp(serial: string, prop: string, value: PrimitiveType): Promise<void>;
    setProp(
        serial: string,
        prop: string,
        value: PrimitiveType,
        cb?: Callback
    ): void;
    setProp(
        serial: string,
        prop: string,
        value: PrimitiveType,
        cb?: Callback
    ): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) =>
                new SetProp(conn).execute(serial, prop, value)
            ),
            cb
        );
    }

    /**
     * Gets property from the device.
     * Analogues to `adb shell getprop <prop>`.
     */
    getProp(serial: string, prop: string): Promise<PropertyValue>;
    getProp(
        serial: string,
        prop: string,
        cb: ValueCallback<PropertyValue>
    ): void;
    getProp(
        serial: string,
        prop: string,
        cb?: ValueCallback<PropertyValue>
    ): Promise<PropertyValue> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new GetPropertyCommand(conn).execute(serial, prop);
            }),
            cb
        );
    }

    /**
     * Puts setting on the device.
     * Analogues to `adb shell settings put <mode> <name> <value>`.
     */
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
        cb: Callback
    ): void;
    putSetting(
        serial: string,
        mode: SettingsMode,
        name: string,
        value: PrimitiveType,
        cb?: Callback
    ): Promise<void> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new PutSetting(conn).execute(serial, mode, name, value);
            }),
            cb
        );
    }

    /**
     * Lists settings of the device.
     * Analogues to `adb shell settings list <mode>`.
     */
    listSettings(serial: string, mode: SettingsMode): Promise<PropertyMap>;
    listSettings(
        serial: string,
        mode: SettingsMode,
        cb: ValueCallback<PropertyMap>
    ): void;
    listSettings(
        serial: string,
        mode: SettingsMode,
        cb?: ValueCallback<PropertyMap>
    ): Promise<PropertyMap> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new ListSettingsCommand(conn).execute(serial, mode);
            }),
            cb
        );
    }

    /**
     * Gets setting from the device.
     * Analogues to `adb shell settings get <mode> <name>`.
     */
    getSetting(
        serial: string,
        mode: SettingsMode,
        name: string
    ): Promise<PropertyValue>;
    getSetting(
        serial: string,
        mode: SettingsMode,
        name: string,
        cb: ValueCallback<PropertyValue>
    ): void;
    getSetting(
        serial: string,
        mode: SettingsMode,
        name: string,
        cb?: ValueCallback<PropertyValue>
    ): Promise<PropertyValue> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new GetSetting(conn).execute(serial, mode, name);
            }),
            cb
        );
    }

    /**
     * Executes a given shell command via adb console interface. Analogous to `adb -s <serial> shell <command>`.
     */
    shell(serial: string, command: string): Promise<string>;
    shell(serial: string, command: string, cb: ValueCallback<string>): void;
    shell(
        serial: string,
        command: string,
        cb?: ValueCallback<string>
    ): Promise<string> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new ShellCommand(conn).execute(serial, command);
            }),
            cb
        );
    }
    /**
     * Enables to execute any custom command.
     * @example
     * class MyCommand extends Command {
     *       execute() {
     *          return super.execute('host:version').then((reply) => {
     *              switch (reply) {
     *                  case Reply.OKAY:
     *                      return this.parser.readValue().then((value) => {
     *                          return parseInt(value.toString(), 10);
     *                      });
     *                  case Reply.FAIL:
     *                      return this.parser.readError().then((e) => {
     *                          throw e;
     *                      });
     *                  default:
     *                      return parseInt(reply, 10);
     *              }
     *          });
     *      }
     *  }
     */
    custom<T>(CustomCommand: CommandConstruct, ...args: any[]): Promise<T> {
        return this.connection().then((conn) => {
            return new CustomCommand(conn).execute(...args);
        });
    }

    /**
     * Enables to execute any custom transport command.
     * @example
     * class MyCommand extends TransportCommand<null> {
     *   Cmd = 'test ';
     *   protected postExecute(): Promise<null> {
     *     return Promise.resolve(null);
     * }
     *   public execute(serial: string, arg: string): Promise<null> {
     *     this.Cmd += arg;
     *     return this.preExecute(serial);
     * }
     */
    customTransport<T>(
        CustomCommand: TransportCommandConstruct<T>,
        serial: string,
        ...args: any[]
    ): Promise<T> {
        return this.connection().then((conn) => {
            return new CustomCommand(conn).execute(serial, ...args);
        });
    }

    /**
     * Establishes a new monkey connection on port `1080`.
     */
    openMonkey(serial: string): Promise<Monkey>;
    openMonkey(serial: string, cb: ValueCallback<Monkey>): void;
    openMonkey(
        serial: string,
        cb?: ValueCallback<Monkey>
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

    /**
     * Force stops given package.
     * Analogous to `adb shell am force-stop <package>`.
     */
    killApp(serial: string, pkg: string): Promise<void>;
    killApp(serial: string, pkg: string, cb: Callback): void;
    killApp(serial: string, pkg: string, cb?: Callback): Promise<void> | void {
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

    /**
     * Executes a given command via adb console interface.
     */
    exec(cmd: string): Promise<string>;
    exec(cmd: string, cb: ValueCallback<string>): void;
    exec(cmd: string, cb?: ValueCallback<string>): Promise<string> | void {
        return nodeify(this.execInternal(cmd), cb);
    }

    /**
     * Executes a given command on specific device via adb console interface.
     *  Analogous to `adb -s <serial> <command>`.
     */
    execDevice(serial: string, cmd: string): Promise<string>;
    execDevice(serial: string, cmd: string, cb: ValueCallback<string>): void;
    execDevice(
        serial: string,
        cmd: string,
        cb?: ValueCallback<string>
    ): Promise<string> | void {
        return nodeify(this.execInternal(...['-s', serial, cmd]), cb);
    }

    /**
     * Executes a given command on specific device shell via adb console interface.
     * Analogous to `adb -s <serial> shell <command>` .
     */
    execDeviceShell(serial: string, cmd: string): Promise<string>;
    execDeviceShell(
        serial: string,
        cmd: string,
        cb: ValueCallback<string>
    ): void;
    execDeviceShell(
        serial: string,
        cmd: string,
        cb?: ValueCallback<string>
    ): Promise<string> | void {
        return nodeify(this.execInternal(...['-s', serial, 'shell', cmd]), cb);
    }

    /**
     * Retrieves current battery status.
     * Analogous to `adb -s <serial> shell dumpsys battery` .
     */
    batteryStatus(serial: string): Promise<PropertyMap>;
    batteryStatus(serial: string, cb: ValueCallback<PropertyMap>): void;
    batteryStatus(
        serial: string,
        cb?: ValueCallback<PropertyMap>
    ): Promise<PropertyMap> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new BatteryStatusCommand(conn).execute(serial);
            }),
            cb
        );
    }

    /**
     * Removes file/folder specified by `path` parameter.
     * Analogous to `adb shell rm <path>`.
     */
    rm(serial: string, path: string): Promise<void>;
    rm(serial: string, path: string, options: RmOptions): Promise<void>;
    rm(serial: string, path: string, cb: Callback): void;
    rm(serial: string, path: string, options: RmOptions, cb: Callback): void;
    rm(
        serial: string,
        path: string,
        options?: RmOptions | Callback,
        cb?: Callback
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

    /**
     * Creates directory specified by `path` parameter.
     * Analogous to `adb shell mkdir <path>`.
     */
    mkdir(serial: string, path: string): Promise<void>;
    mkdir(serial: string, path: string, options?: MkDirOptions): Promise<void>;
    mkdir(serial: string, path: string, cb: Callback): void;
    mkdir(
        serial: string,
        path: string,
        options: MkDirOptions,
        cb: Callback
    ): void;
    mkdir(
        serial: string,
        path: string,
        options?: MkDirOptions | Callback,
        cb?: Callback
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

    /**
     * Updates access and modification times of file specified by `path` parameter, or creates a new file.
     * Analogous to `adb shell touch <filename>`.
     */
    touch(serial: string, path: string): Promise<void>;
    touch(serial: string, path: string, options: TouchOptions): Promise<void>;
    touch(serial: string, path: string, cb: Callback): void;
    touch(
        serial: string,
        path: string,
        options: TouchOptions,
        cb: Callback
    ): void;
    touch(
        serial: string,
        path: string,
        options?: TouchOptions | Callback,
        cb?: Callback
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

    /**
     * Moves data with `srcPath` to `destPath` parameter.
     * Analogous to `adb shell mv <src> <dest>`.
     */
    mv(serial: string, srcPath: string, destPath: string): Promise<void>;
    mv(
        serial: string,
        srcPath: string,
        destPath: string,
        options: MvOptions
    ): Promise<void>;
    mv(serial: string, srcPath: string, destPath: string, cb: Callback): void;
    mv(
        serial: string,
        srcPath: string,
        destPath: string,
        options: MvOptions,
        cb: Callback
    ): void;
    mv(
        serial: string,
        srcPath: string,
        destPath: string,
        options?: Callback | MvOptions,
        cb?: Callback
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

    /**
     * Copies data with `srcPath` to `destPath` parameter.
     * Analogous to `adb shell cp <src> <dest>`.
     */
    cp(serial: string, srcPath: string, destPath: string): Promise<void>;
    cp(
        serial: string,
        srcPath: string,
        destPath: string,
        options: CpOptions
    ): Promise<void>;
    cp(serial: string, srcPath: string, destPath: string, cb: Callback): void;
    cp(
        serial: string,
        srcPath: string,
        destPath: string,
        options: CpOptions,
        cb: Callback
    ): void;
    cp(
        serial: string,
        srcPath: string,
        destPath: string,
        options?: Callback | CpOptions,
        cb?: Callback
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

    /**
     * Gets file stats for specified path.
     * Analogous to `adb stat <filepath>`.
     */
    fileStat(serial: string, path: string): Promise<FileStat>;
    fileStat(serial: string, path: string, cb: ValueCallback<FileStat>): void;
    fileStat(
        serial: string,
        path: string,
        cb?: ValueCallback<FileStat>
    ): Promise<FileStat> | void {
        return nodeify(
            this.connection().then((conn) => {
                return new FileStatCommand(conn).execute(serial, path);
            }),
            cb
        );
    }
}
