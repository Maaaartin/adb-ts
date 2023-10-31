import {
    AdbClientOptions,
    AdbClientOptionsValues,
    InputDurationOptions,
    CommandConstruct,
    CpOptions,
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
    TransportCommandConstruct,
    KeyCode,
    parsePrimitiveParam,
    AdbExecError,
    autoUnregister
} from './util';
import { Sync, SyncMode } from './sync';
import { execFile } from 'child_process';
import fs from 'fs';
import { Device } from './device';
import BatteryStatusCommand from './commands/host-transport/batteryStatus';
import ClearCommand from './commands/host-transport/clear';
import Connect from './commands/host/connect';
import { Connection } from './connection';
import CpCommand from './commands/host-transport/fileSystem/cp';
import Disconnect from './commands/host/disconnect';
import FileStatCommand from './commands/host-transport/fileStat';
import { FileStat } from './filestats';
import ForwardCommand from './commands/host-serial/forward';
import GetDevicePathCommand from './commands/host-serial/getdevicepath';
import GetIpAddressCommand from './commands/host-transport/ipaddress';
import GetPropertyCommand from './commands/host-transport/getproperty';
import GetSetting from './commands/host-transport/getsetting';
import HostTransportCommand from './commands/host/transport';
import InstallCommand from './commands/host-transport/install';
import IsInstalledCommand from './commands/host-transport/isinstalled';
import KillCommand from './commands/host/kill';
import ListDevicesCommand from './commands/host/listdevices';
import ListFeaturesCommand from './commands/host-transport/listfeatures';
import ListForwardsCommand from './commands/host-serial/listforwards';
import ListPackagesCommand from './commands/host-transport/listpackages';
import ListPropertiesCommand from './commands/host-transport/listproperties';
import ListReversesCommand from './commands/host-transport/listreverses';
import ListSettingsCommand from './commands/host-transport/listSettings';
import LogcatCommand from './commands/host-transport/logcat';
import { LogcatReader } from './logcat/reader';
import MkDirCommand from './commands/host-transport/fileSystem/mkdir';
import { Monkey } from './monkey/client';
import MonkeyCommand from './commands/host-transport/monkey';
import MvCommand from './commands/host-transport/fileSystem/mv';
import { PullTransfer } from './sync/pulltransfer';
import { PushTransfer } from './sync/pushtransfer';
import PutSetting from './commands/host-transport/putSetting';
import { Readable } from 'stream';
import RebootCommand from './commands/host-transport/reboot';
import RemountCommand from './commands/host-transport/remount';
import ReverseCommand from './commands/host-transport/reverse';
import RmCommand from './commands/host-transport/fileSystem/rm';
import RootCommand from './commands/host-transport/root';
import ScreenShotCommand from './commands/host-transport/screencap';
import SetProp from './commands/host-transport/setProperty';
import ShellCommand from './commands/host-transport/shell';
import DeleteApk from './commands/host-transport/deleteApk';
import ShutdownCommand from './commands/host-transport/shutdown';
import StartActivityCommand from './commands/host-transport/startActivity';
import StartServiceCommand from './commands/host-transport/startservice';
import SyncCommand from './commands/host-transport/sync';
import SyncEntry from './sync/entry';
import TcpCommand from './commands/host-transport/tcp';
import TcpIpCommand from './commands/host-transport/tcpip';
import TouchCommand from './commands/host-transport/fileSystem/touch';
import TrackCommand from './commands/host/trackdevices';
import { Tracker } from './tracker';
import UninstallCommand from './commands/host-transport/uninstall';
import UsbCommand from './commands/host-transport/usb';
import VersionCommand from './commands/host/version';
import WaitBootCompleteCommand from './commands/host-transport/waitBootComplete';
import WaitFor from './commands/host/waitFor';
import { promisify } from 'util';
import T from 'timers/promises';
import Text from './commands/host-transport/input/text';
import Roll from './commands/host-transport/input/roll';
import DragAndDrop from './commands/host-transport/input/dragAndDrop';
import Swipe from './commands/host-transport/input/swipe';
import Press from './commands/host-transport/input/press';
import KeyEvent from './commands/host-transport/input/keyEvent';
import Tap from './commands/host-transport/input/tap';

const ADB_DEFAULT_PORT = 5555;
const DEFAULT_OPTIONS = {
    port: 5037,
    host: 'localhost',
    bin: 'adb',
    noAutoStart: false
} as const;

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
    public startServer(): Promise<void> {
        const port = this.options.port;
        const args = ['-P', port.toString(), 'start-server'];
        return promisify<void>((cb_) =>
            execFile(this.options.bin, args, (err) => cb_(err))
        )();
    }

    private connection(): Promise<Connection> {
        return new Promise<Connection>((resolve, reject) => {
            let triedStarting = false;
            const connection = new Connection();

            const errorListener = async (
                err: NodeJS.ErrnoException
            ): Promise<void> => {
                if (
                    err.code === 'ECONNREFUSED' &&
                    !triedStarting &&
                    !this.options.noAutoStart
                ) {
                    triedStarting = true;
                    await this.startServer();
                    connection.connect(this.options);
                    return;
                }
                connection.destroy();
                return reject(err);
            };
            connection.on('error', errorListener);
            connection.once('connect', () => {
                connection.off('error', errorListener);
                return resolve(connection);
            });
            connection.connect(this.options);
        });
    }

    public async transport(serial: string): Promise<Connection> {
        const conn = await this.connection();
        await new HostTransportCommand(conn, serial).execute();
        return conn;
    }

    /**
     * Gets the adb server version.
     */
    public async version(): Promise<number> {
        return new VersionCommand(await this.connection()).execute();
    }

    private async ipConnect(
        Construct: IpConnectConstruct,
        host: string,
        port: number | undefined
    ): Promise<string> {
        if (host.indexOf(':') !== -1) {
            const [h, p] = host.split(':', 2);
            host = h;
            port = parseInt(p);
        }
        const conn = await this.connection();
        return new Construct(
            conn,
            host,
            parsePrimitiveParam(ADB_DEFAULT_PORT, port)
        ).execute();
    }

    /**
     * Connects to device over local network.
     * @example
     * adb.map(async (device) => {
     *    await device.tcpip();
     *    const [ip] = await device.getIpAddress();
     *    await adb.connect(ip);
     *});
     */
    public connect(host: string): Promise<string>;
    public connect(host: string, port: number): Promise<string>;
    public connect(host: string, port?: number): Promise<string> {
        return this.ipConnect(Connect, host, port);
    }

    /**
     * Disconnects from the given device.
     */
    public disconnect(host: string): Promise<string>;
    public disconnect(host: string, port: number): Promise<string>;
    public disconnect(host: string, port?: number): Promise<string> {
        return this.ipConnect(Disconnect, host, port);
    }

    /**
     * Gets the list of currently connected devices and emulators.
     */
    public async listDevices(): Promise<IDevice[]> {
        return new ListDevicesCommand(await this.connection()).execute();
    }

    /**
     * Tracks connection status of devices.
     */
    public async trackDevices(): Promise<Tracker> {
        const conn = await this.connection();
        const command = new TrackCommand(conn);
        await command.execute();
        return new Tracker(command, this);
    }

    /**
     * Kills the adb server.
     */
    public kill(): Promise<void> {
        // TODO try catch
        return this.connection()
            .catch((error) => {
                if (error.code !== 'ECONNREFUSED') {
                    throw error;
                }
            })
            .then((conn) => conn && new KillCommand(conn).execute());
    }

    /**
     * Gets the serial number of the device.
     * Meant for getting serial number of local devices.
     * Analogous to `adb shell getprop ro.serialno`.
     */
    public async getSerialNo(serial: string): Promise<string> {
        // TODO should trim
        const serialNo = await this.getProp(serial, 'ro.serialno');
        return String(serialNo);
    }

    /**
     * Gets the device path of the device identified by the device.
     */
    public async getDevicePath(serial: string): Promise<string> {
        return new GetDevicePathCommand(
            await this.connection(),
            serial
        ).execute();
    }

    /**
     * Lists properties of the device.
     * Analogous to `adb shell getprop`.
     */
    public async listProperties(serial: string): Promise<PropertyMap> {
        return new ListPropertiesCommand(
            await this.connection(),
            serial
        ).execute();
    }

    /**
     * Lists features of the device.
     * Analogous to `adb shell pm list features`.
     */
    public async listFeatures(serial: string): Promise<PropertyMap> {
        return new ListFeaturesCommand(
            await this.connection(),
            serial
        ).execute();
    }

    /**
     * Lists installed packages.
     * Analogous to `adb shell pm list packages`.
     */
    public async listPackages(serial: string): Promise<string[]> {
        return new ListPackagesCommand(
            await this.connection(),
            serial
        ).execute();
    }

    /**
     * Gets the ipv4 addresses of default wlan interface.
     */
    public async getIpAddress(serial: string): Promise<string[]> {
        return new GetIpAddressCommand(
            await this.connection(),
            serial
        ).execute();
    }

    /**
     * Forwards socket connections from the ADB server host (local) to the device (remote).
     * Analogous to `adb forward <local> <remote>`.
     * @example
     * adb.forward('serial', 'tcp:9222', 'localabstract:chrome_devtools_remote')
     */
    public async forward(
        serial: string,
        local: string,
        remote: string
    ): Promise<void> {
        return new ForwardCommand(
            await this.connection(),
            serial,
            local,
            remote
        ).execute();
    }

    /**
     * Lists all forwarded connections.
     * Analogous to `adb forward --list`.
     */
    public async listForwards(serial: string): Promise<ForwardsObject[]> {
        return new ListForwardsCommand(
            await this.connection(),
            serial
        ).execute();
    }

    /**
     * Reverses socket connections from the device (remote) to the ADB server host (local).
     * Analogous to `adb reverse <remote> <local>`.
     * @example
     * adb.reverse('serial', 'localabstract:chrome_devtools_remote', 'tcp:9222')
     */
    public async reverse(
        serial: string,
        local: string,
        remote: string
    ): Promise<void> {
        return new ReverseCommand(
            await this.connection(),
            serial,
            local,
            remote
        ).execute();
    }

    /**
     * Lists all reversed connections.
     * Analogous to `adb reverse --list`.
     */
    public async listReverses(serial: string): Promise<ReversesObject[]> {
        return new ListReversesCommand(
            await this.connection(),
            serial
        ).execute();
    }

    private deleteApk(serial: string, pathToApk: string): Promise<void> {
        return this.connection().then((conn) => {
            return new DeleteApk(conn, serial, pathToApk).execute();
        });
    }

    /**
     * Reboots the device.
     * Analogous to `adb reboot`.
     */
    public async reboot(serial: string): Promise<void> {
        return new RebootCommand(await this.connection(), serial).execute();
    }

    /**
     * Shuts the device down.
     * Analogous to `adb reboot -p`.
     */
    public async shutdown(serial: string): Promise<void> {
        return new ShutdownCommand(await this.connection(), serial).execute();
    }

    /**
     * Attempts to remount the `/system` partition in read-write mode.
     * Can be done on a rooted device. Analogous to `adb remount`.
     * Analogous to `adb remount`
     */
    public async remount(serial: string): Promise<void> {
        return new RemountCommand(await this.connection(), serial).execute();
    }

    /**
     * Attempts to which the device to the root mode.
     * Analogous to `adb root`.
     */
    public async root(serial: string): Promise<void> {
        return new RootCommand(await this.connection(), serial).execute();
    }

    /**
     * Takes a screenshot on the specified device.
     * Analogous to `adb shell screencap -p`.
     */
    public async screenshot(serial: string): Promise<Buffer> {
        return new ScreenShotCommand(await this.connection(), serial).execute();
    }

    /**
     * Opens a direct TCP connection to specified port on the device.
     * Analogous to `adb tcp <port>:<host>`.
     * @example
     * const socket = await adb.openTcp('serial', 5555);
     * // socket.write(...)
     */
    public async openTcp(serial: string, port: number): Promise<Connection>;
    public async openTcp(
        serial: string,
        port: number,
        host: string
    ): Promise<Connection>;
    public async openTcp(
        serial: string,
        port: number,
        host?: string
    ): Promise<Connection> {
        return new TcpCommand(
            await this.connection(),
            serial,
            port,
            host
        ).execute();
    }

    /**
     * Sends roll input command to the device shell.
     * Analogous to `adb shell input trackball roll <x> <y>`.
     * Default input source is `trackball`.
     * @param x Horizontal coordinate.
     * @param y Vertical coordinate.
     */
    public async roll(serial: string, x: number, y: number): Promise<void>;
    public async roll(
        serial: string,
        x: number,
        y: number,
        source: InputSource
    ): Promise<void>;
    public async roll(
        serial: string,
        x: number,
        y: number,
        source?: InputSource
    ): Promise<void> {
        return new Roll(await this.connection(), serial, {
            source,
            x,
            y
        }).execute();
    }

    /**
     * Sends roll input command to the device shell.
     * Analogous to `adb shell input trackball press`.
     * Default input source is `trackball`.
     */
    public async press(serial: string): Promise<void>;
    public async press(serial: string, source: InputSource): Promise<void>;
    public async press(serial: string, source?: InputSource): Promise<void> {
        return new Press(await this.connection(), serial, source).execute();
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
    public async dragAndDrop(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): Promise<void>;
    public async dragAndDrop(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options: InputDurationOptions
    ): Promise<void>;
    public async dragAndDrop(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: InputDurationOptions
    ): Promise<void> {
        return new DragAndDrop(await this.connection(), serial, {
            x1,
            y1,
            x2,
            y2,
            options
        }).execute();
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
    public async swipe(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): Promise<void>;
    public async swipe(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options: InputDurationOptions
    ): Promise<void>;
    public async swipe(
        serial: string,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: InputDurationOptions
    ): Promise<void> {
        return new Swipe(await this.connection(), serial, {
            x1,
            y1,
            x2,
            y2,
            options
        }).execute();
    }

    /**
     * Sends keyevent input command to the device shell.
     * Analogous to `adb shell input keyboard keyevent <code>`.
     * Default input source is `keyboard`.
     * @param code Key code to send.
     */
    public async keyEvent(
        serial: string,
        code: KeyCode | NonEmptyArray<KeyCode>
    ): Promise<void>;
    public async keyEvent(
        serial: string,
        code: number | NonEmptyArray<number>
    ): Promise<void>;

    public async keyEvent(
        serial: string,
        code: KeyCode | NonEmptyArray<KeyCode>,
        options: KeyEventOptions
    ): Promise<void>;
    public async keyEvent(
        serial: string,
        code: number | NonEmptyArray<number>,
        options?: KeyEventOptions
    ): Promise<void> {
        return new KeyEvent(await this.connection(), serial, {
            options,
            code
        }).execute();
    }

    /**
     * Sends tap input command to the device shell.
     * Analogous to `adb shell input touchscreen tap <x> <y>`.
     * Default input source is `touchscreen`.
     * @param x Horizontal coordinate.
     * @param y Vertical coordinate.
     */
    public async tap(serial: string, x: number, y: number): Promise<void>;
    public async tap(
        serial: string,
        x: number,
        y: number,
        source: InputSource
    ): Promise<void>;
    public async tap(
        serial: string,
        x: number,
        y: number,
        source?: InputSource
    ): Promise<void> {
        return new Tap(await this.connection(), serial, {
            source,
            x,
            y
        }).execute();
    }

    /**
     * Sends text input command to the device shell.
     * Analogous to `adb shell input touchscreen text '<text>'`.
     * Default input source is `touchscreen`.
     */
    public async text(serial: string, text: string): Promise<void>;
    public async text(
        serial: string,
        text: string,
        source: InputSource
    ): Promise<void>;
    public async text(
        serial: string,
        text: string,
        source?: InputSource
    ): Promise<void> {
        return new Text(await this.connection(), serial, {
            source,
            text
        }).execute();
    }

    /**
     * Opens logcat.
     * Analogous to `adb logcat`.
     * @see `LogcatReader` and `LogcatOptions` for more details.
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
    public async openLogcat(serial: string): Promise<LogcatReader>;
    public async openLogcat(
        serial: string,
        options: LogcatOptions
    ): Promise<LogcatReader>;
    public async openLogcat(
        serial: string,
        options?: LogcatOptions
    ): Promise<LogcatReader> {
        return new LogcatCommand(
            await this.connection(),
            serial,
            options
        ).execute();
    }

    private syncService(serial: string): Promise<Sync> {
        return this.connection().then((conn) => {
            return new SyncCommand(conn, serial).execute();
        });
    }

    /**
     * Deletes all data associated with a package from the device.
     * Analogous to `adb shell pm clear <pkg>`.
     */
    public async clear(serial: string, pkg: string): Promise<void> {
        return new ClearCommand(await this.connection(), serial, pkg).execute();
    }

    private async installRemote(
        serial: string,
        apk: string,
        options: InstallOptions | undefined,
        args: string | undefined
    ): Promise<void> {
        await new InstallCommand(
            await this.connection(),
            serial,
            apk,
            options,
            args
        ).execute();
        return this.deleteApk(serial, apk);
    }
    /**
     * Installs an apk to the device.
     * Analogous to `adb install <pkg>`.
     */
    public async install(serial: string, apk: string | Readable): Promise<void>;
    public async install(
        serial: string,
        apk: string | Readable,
        options: InstallOptions
    ): Promise<void>;
    /**
     * @param args Extra arguments. E.g. `--fastdeploy` flag.
     */
    public async install(
        serial: string,
        apk: string | Readable,
        options: InstallOptions,
        args: string
    ): Promise<void>;
    public async install(
        serial: string,
        apk: string | Readable,
        options?: InstallOptions,
        args?: string
    ): Promise<void> {
        const temp = Sync.temp(typeof apk === 'string' ? apk : '_stream.apk');
        return autoUnregister(
            await this.push(serial, apk, temp),
            (transfer) =>
                new Promise<void>((resolve, reject) => {
                    transfer.on('error', reject).on('end', () => {
                        this.installRemote(serial, temp, options, args)
                            .then(resolve)
                            .catch(reject);
                    });
                })
        );
    }

    /**
     * Uninstalls a package from the device.
     * Analogous to `adb uninstall`.
     */
    public async uninstall(serial: string, pkg: string): Promise<void>;
    public async uninstall(
        serial: string,
        pkg: string,
        options: UninstallOptions
    ): Promise<void>;
    public async uninstall(
        serial: string,
        pkg: string,
        options?: UninstallOptions
    ): Promise<void> {
        return new UninstallCommand(
            await this.connection(),
            serial,
            pkg,
            options
        ).execute();
    }

    /**
     * Tells if a package is installed or not.
     */
    public async isInstalled(serial: string, pkg: string): Promise<boolean> {
        return new IsInstalledCommand(
            await this.connection(),
            serial,
            pkg
        ).execute();
    }

    /**
     * Starts a new activity with options.
     * Analogous to `adb shell am start <pkg./activity>`.
     */
    public async startActivity(
        serial: string,
        pkg: string,
        activity: string
    ): Promise<void>;
    public async startActivity(
        serial: string,
        pkg: string,
        activity: string,
        options: StartActivityOptions
    ): Promise<void>;
    public async startActivity(
        serial: string,
        pkg: string,
        activity: string,
        options?: StartActivityOptions
    ): Promise<void> {
        return new StartActivityCommand(
            await this.connection(),
            serial,
            pkg,
            activity,
            options
        ).execute();
    }

    /**
     * Starts a new service with options.
     * Analogous to `adb shell am startservice <pkg> <service>`.
     */
    public async startService(
        serial: string,
        pkg: string,
        service: string
    ): Promise<void>;
    public async startService(
        serial: string,
        pkg: string,
        service: string,
        options: StartServiceOptions
    ): Promise<void>;
    public async startService(
        serial: string,
        pkg: string,
        service: string,
        options?: StartServiceOptions
    ): Promise<void> {
        return new StartServiceCommand(
            await this.connection(),
            serial,
            pkg,
            service,
            options
        ).execute();
    }

    /**
     * Reads given directory.
     * The path should start with `/`.
     */
    public async readDir(serial: string, path: string): Promise<SyncEntry[]> {
        const sync = await this.syncService(serial);
        try {
            return await sync.readDir(path);
        } finally {
            sync.end();
        }
    }

    /**
     * Gets a PullTransfer instance.
     * @see `PullTransfer`
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
    public async pull(serial: string, path: string): Promise<PullTransfer> {
        const sync = await this.syncService(serial);
        return sync.pull(path).on('end', () => sync.end());
    }

    /**
     * Gets a PushTransfer instance.
     * @see `PushTransfer`
     * @example
     * const transfer = await adb.push('serial', '/path-src', '/path-dest')
     * transfer.on('end', () => { });
     */
    public async push(
        serial: string,
        srcPath: string | Readable,
        destPath: string
    ): Promise<PushTransfer>;
    public async push(
        serial: string,
        srcPath: string | Readable,
        destPath: string,
        mode: SyncMode
    ): Promise<PushTransfer>;
    public async push(
        serial: string,
        srcPath: string | Readable,
        destPath: string,
        mode?: SyncMode
    ): Promise<PushTransfer> {
        const sync = await this.syncService(serial);
        return sync.push(srcPath, destPath, mode).on('end', () => sync.end());
    }

    private async awaitActiveDevice(serial: string): Promise<void> {
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
        const tracker = await this.trackDevices();
        try {
            return await Promise.race([
                T.setTimeout(5000, undefined, { ref: false }),
                track(tracker)
            ]);
        } finally {
            tracker.end();
        }
    }

    /**
     * Puts the device ADB daemon into tcp mode.
     * Afterwards it is possible to use `connect` method.
     * Analogous to `adb tcpip 5555`.
     */
    public async tcpip(serial: string): Promise<void>;
    public async tcpip(serial: string, port: number): Promise<void>;
    public async tcpip(serial: string, port?: number): Promise<void> {
        return new TcpIpCommand(
            await this.connection(),
            serial,
            this.awaitActiveDevice(serial),
            parsePrimitiveParam(ADB_DEFAULT_PORT, port)
        ).execute();
    }

    /**
     * Sets the device transport back to usb.
     */
    public async usb(serial: string): Promise<void> {
        return new UsbCommand(
            await this.connection(),
            serial,
            this.awaitActiveDevice(serial)
        ).execute();
    }

    /**
     * Waits until the device has finished booting.
     */
    public async waitBootComplete(serial: string): Promise<void> {
        return new WaitBootCompleteCommand(
            await this.connection(),
            serial
        ).execute();
    }

    /**
     * Waits until the device is in the given state.
     * Analogous to `adb wait-for-<transport>-<state>`.
     */
    public async waitFor(
        transport: WaitForType,
        state: WaitForState
    ): Promise<void> {
        return new WaitFor(await this.connection(), transport, state).execute();
    }

    /**
     * Maps through all connected devices.
     */
    public async map<T>(
        mapper: (device: Device) => Promise<T> | T
    ): Promise<T[]> {
        const devices = await this.listDevices();
        return Promise.all(
            devices.map((device) => mapper(new Device(this, device)))
        );
    }

    private async pushInternal(
        serial: string,
        data: string | Readable,
        dest: string
    ): Promise<void> {
        const transfer = await this.push(serial, data, dest);
        return new Promise((resolve, reject) => {
            transfer.once('end', resolve);
            transfer.once('error', reject);
        });
    }

    /**
     * Wraps {@link push} method, provides API for quick data writing.
     */
    public pushDataToFile(
        serial: string,
        data: string | Buffer | Readable,
        destPath: string
    ): Promise<void> {
        return this.pushInternal(
            serial,
            Readable.from(
                typeof data === 'string' ? Buffer.from(data, 'utf-8') : data
            ),
            destPath
        );
    }

    /**
     * Wraps {@link push} method, reads the content of file on the host to a file on the device.
     */
    public pushFile(
        serial: string,
        srcPath: string,
        destPath: string
    ): Promise<void> {
        return this.pushInternal(serial, srcPath, destPath);
    }

    /**
     * Wraps {@link pull} method, reads the file content and resolves with the output.
     */
    public async pullDataFromFile(
        serial: string,
        srcPath: string
    ): Promise<Buffer> {
        const transfer = await this.pull(serial, srcPath);
        return new Promise((resolve, reject) => {
            let data = Buffer.alloc(0);
            transfer.on('data', (chunk) => {
                data = Buffer.isBuffer(chunk)
                    ? Buffer.concat([data, chunk])
                    : data;
            });
            transfer.on('end', () => resolve(data));
            transfer.on('error', reject);
        });
    }

    /**
     * Wraps {@link pull} method, reads the content of file on the device and write it to a file on the machine.
     */
    public async pullFile(
        serial: string,
        srcPath: string,
        destPath: string
    ): Promise<void> {
        return autoUnregister(
            this.pull(serial, srcPath),
            (transfer) =>
                new Promise<void>((resolve, reject) => {
                    transfer
                        .once('readable', () =>
                            transfer.pipe(fs.createWriteStream(destPath))
                        )
                        .once('end', resolve)
                        .once('error', reject);
                })
        );
    }

    /**
     * Sets property on the device.
     * Analogues to `adb shell setprop <prop> <value>`.
     */
    public async setProp(
        serial: string,
        prop: string,
        value: PrimitiveType
    ): Promise<void> {
        return new SetProp(
            await this.connection(),
            serial,
            prop,
            value
        ).execute();
    }

    /**
     * Gets property from the device.
     * Analogues to `adb shell getprop <prop>`.
     */
    public async getProp(serial: string, prop: string): Promise<PropertyValue> {
        return new GetPropertyCommand(
            await this.connection(),
            serial,
            prop
        ).execute();
    }

    /**
     * Puts setting on the device.
     * Analogues to `adb shell settings put <mode> <name> <value>`.
     */
    public async putSetting(
        serial: string,
        mode: SettingsMode,
        name: string,
        value: PrimitiveType
    ): Promise<void> {
        return new PutSetting(
            await this.connection(),
            serial,
            mode,
            name,
            value
        ).execute();
    }

    /**
     * Lists settings of the device.
     * Analogues to `adb shell settings list <mode>`.
     */
    public async listSettings(
        serial: string,
        mode: SettingsMode
    ): Promise<PropertyMap> {
        return new ListSettingsCommand(
            await this.connection(),
            serial,
            mode
        ).execute();
    }

    /**
     * Gets setting from the device.
     * Analogues to `adb shell settings get <mode> <name>`.
     */
    public async getSetting(
        serial: string,
        mode: SettingsMode,
        name: string
    ): Promise<PropertyValue> {
        return new GetSetting(
            await this.connection(),
            serial,
            mode,
            name
        ).execute();
    }

    /**
     * Executes a given shell command via adb console interface. Analogous to `adb -s <serial> shell <command>`.
     */
    public async shell(serial: string, command: string): Promise<string> {
        return new ShellCommand(
            await this.connection(),
            serial,
            command
        ).execute();
    }

    /**
     * Enables to execute any custom command.
     * @example
     *   class MyCommand extends Command<number> {
     *   protected autoEnd = true;
     *   private arg: string;
     *   constructor(connection: Connection, arg: string) {
     *       super(connection);
     *       this.arg = arg;
     *   }
     *   async execute(): Promise<number> {
     *       const reply = await this.initExecute(this.arg);
     *       switch (reply) {
     *           case Reply.OKAY:
     *               const value = await this.parser.readValue();
     *               return parseInt(value.toString(), 10);
     *           case Reply.FAIL:
     *               throw await this.parser.readError();
     *           default:
     *               return parseInt(reply, 10);
     *          }
     *      }
     *  }
     */
    public async custom<T, P extends unknown[] = unknown[]>(
        CustomCommand: CommandConstruct<T, P>,
        ...args: P
    ): Promise<T> {
        const conn = await this.connection();
        return new CustomCommand(conn, ...args).execute();
    }

    /**
     * Enables to execute any custom transport command.
     * @example
     *    class MyCommand extends TransportCommand<null> {
     *    protected keepAlive = false;
     *    private arg: string;
     *    constructor(connection: Connection, serial: string, arg: string) {
     *        super(connection, serial);
     *        this.arg = arg;
     *    }
     *    protected get Cmd() {
     *        return 'test '.concat(this.arg);
     *    }
     *    protected postExecute(): null {
     *        return null;
     *    }
     * }
     */
    public async customTransport<T, P extends unknown[] = unknown[]>(
        CustomCommand: TransportCommandConstruct<T, P>,
        serial: string,
        ...args: P
    ): Promise<T> {
        const conn = await this.connection();
        return new CustomCommand(conn, serial, ...args).execute();
    }

    /**
     * Establishes a new monkey connection on port `1080`.
     */
    public openMonkey(serial: string): Promise<Monkey> {
        const tryConnect = async (times: number): Promise<Monkey> => {
            try {
                const stream = await this.openTcp(serial, 1080);
                return new Monkey().connect(stream);
            } catch (err) {
                if ((times -= 1)) {
                    await T.setTimeout(100);
                    return tryConnect(times);
                }
                throw err;
            }
        };

        const establishConnection = async (
            attempts: number
        ): Promise<Monkey> => {
            const tryConnectHandler = async (
                conn: Connection,
                monkey: Monkey
            ): Promise<Monkey> => {
                await T.setTimeout(100);
                const hookMonkey = async (): Promise<Monkey> => {
                    return monkey.once('end', () => conn.end());
                };

                if (monkey.stream.readyState !== 'closed') {
                    return hookMonkey();
                }

                conn.end();
                // if attempts fail, return monkey anyway
                return attempts === 0
                    ? hookMonkey()
                    : establishConnection(attempts - 1);
            };
            const transport = await this.transport(serial);
            const conn_2 = await new MonkeyCommand(
                transport,
                serial,
                1080
            ).execute();
            return tryConnect(20).then(
                (monkey_1) => tryConnectHandler(conn_2, monkey_1),
                (err) => {
                    conn_2.end();
                    throw err;
                }
            );
        };
        return establishConnection(3);
    }

    /**
     * Force stops given package.
     * Analogous to `adb shell am force-stop <package>`.
     */
    public async killApp(serial: string, pkg: string): Promise<void> {
        await this.shell(serial, `am force-stop ${pkg}`);
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
    public exec(cmd: string): Promise<string> {
        return this.execInternal(cmd);
    }

    /**
     * Executes a given command on specific device via adb console interface.
     *  Analogous to `adb -s <serial> <command>`.
     */
    public execDevice(serial: string, cmd: string): Promise<string> {
        return this.execInternal(...['-s', serial, cmd]);
    }

    /**
     * Executes a given command on specific device shell via adb console interface.
     * Analogous to `adb -s <serial> shell <command>` .
     */
    public execDeviceShell(serial: string, cmd: string): Promise<string> {
        return this.execInternal(...['-s', serial, 'shell', cmd]);
    }

    /**
     * Retrieves current battery status.
     * Analogous to `adb -s <serial> shell dumpsys battery` .
     */
    public async batteryStatus(serial: string): Promise<PropertyMap> {
        return new BatteryStatusCommand(
            await this.connection(),
            serial
        ).execute();
    }

    /**
     * Removes file/folder specified by `path` parameter.
     * Analogous to `adb shell rm <path>`.
     */
    public async rm(serial: string, path: string): Promise<void>;
    public async rm(
        serial: string,
        path: string,
        options: RmOptions
    ): Promise<void>;
    public async rm(
        serial: string,
        path: string,
        options?: RmOptions
    ): Promise<void> {
        return new RmCommand(
            await this.connection(),
            serial,
            path,
            options
        ).execute();
    }

    /**
     * Creates directory specified by `path` parameter.
     * Analogous to `adb shell mkdir <path>`.
     */
    public async mkdir(serial: string, path: string): Promise<void>;
    public async mkdir(
        serial: string,
        path: string,
        options: MkDirOptions
    ): Promise<void>;
    public async mkdir(
        serial: string,
        path: string,
        options?: MkDirOptions
    ): Promise<void> {
        return new MkDirCommand(
            await this.connection(),
            serial,
            path,
            options
        ).execute();
    }

    /**
     * Updates access and modification times of file specified by `path` parameter, or creates a new file.
     * Analogous to `adb shell touch <filename>`.
     */
    public async touch(serial: string, path: string): Promise<void>;
    public async touch(
        serial: string,
        path: string,
        options: TouchOptions
    ): Promise<void>;
    public async touch(
        serial: string,
        path: string,
        options?: TouchOptions
    ): Promise<void> {
        return new TouchCommand(
            await this.connection(),
            serial,
            path,
            options
        ).execute();
    }

    /**
     * Moves data with `srcPath` to `destPath` parameter.
     * Analogous to `adb shell mv <src> <dest>`.
     */
    public async mv(
        serial: string,
        srcPath: string,
        destPath: string
    ): Promise<void>;
    public async mv(
        serial: string,
        srcPath: string,
        destPath: string,
        options: MvOptions
    ): Promise<void>;
    public async mv(
        serial: string,
        srcPath: string,
        destPath: string,
        options?: MvOptions
    ): Promise<void> {
        return new MvCommand(
            await this.connection(),
            serial,
            [srcPath, destPath],
            options
        ).execute();
    }

    /**
     * Copies data with `srcPath` to `destPath` parameter.
     * Analogous to `adb shell cp <src> <dest>`.
     */
    public async cp(
        serial: string,
        srcPath: string,
        destPath: string
    ): Promise<void>;
    public async cp(
        serial: string,
        srcPath: string,
        destPath: string,
        options: CpOptions
    ): Promise<void>;
    public async cp(
        serial: string,
        srcPath: string,
        destPath: string,
        options?: CpOptions
    ): Promise<void> {
        return new CpCommand(
            await this.connection(),
            serial,
            [srcPath, destPath],
            options
        ).execute();
    }

    /**
     * Gets file stats for specified path.
     * Analogous to `adb stat <filepath>`.
     */
    public async fileStat(serial: string, path: string): Promise<FileStat> {
        return new FileStatCommand(
            await this.connection(),
            serial,
            path
        ).execute();
    }
}
