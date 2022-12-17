import {
    CommandConstruct,
    CpOptions,
    DeviceState,
    ForwardsObject,
    IAdbDevice,
    InputOptions,
    InputSource,
    InstallOptions,
    PrimitiveDictionary,
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
    TransportType,
    UninstallOptions,
    DataMap,
    ExecCallbackWithValue,
    ExecCallback
} from '.';

import AdbClient from './client';
import Connection from './connection';
import FileStat from './filestats';
import { KeyCode } from './keycode';
import LogcatReader from './logcat/reader';
import Monkey from './monkey/client';
import PullTransfer from './sync/pulltransfer';
import PushTransfer from './sync/pushtransfer';
import { Readable } from 'stream';
import SyncEntry from './sync/entry';
import { SyncMode } from './sync';

export default class AdbDevice implements IAdbDevice {
    id: string;
    state: DeviceState;
    path: string | undefined;
    device: string | undefined;
    model: string | undefined;
    product: string | undefined;
    transportId: string;
    transport: TransportType;
    private client: AdbClient;

    constructor(client: AdbClient, props: IAdbDevice) {
        this.id = props.id;
        this.state = props.state;
        this.path = props.path;
        this.device = props.device;
        this.model = props.model;
        this.product = props.product;
        this.transportId = props.transportId;
        this.transport = props.transport;
        this.client = client;
    }

    getSerialNo(): Promise<string> {
        return this.client.getSerialNo(this.id);
    }

    getDevicePath(): Promise<string> {
        return this.client.getDevicePath(this.id);
    }

    listProperties(): Promise<DataMap> {
        return this.client.listProperties(this.id);
    }

    listFeatures(): Promise<DataMap> {
        return this.client.listFeatures(this.id);
    }

    listPackages(): Promise<string[]> {
        return this.client.listPackages(this.id);
    }

    getIpAddress(): Promise<string | string[] | null> {
        return this.client.getIpAddress(this.id);
    }

    forward(local: string, remote: string): Promise<void> {
        return this.client.forward(this.id, local, remote);
    }

    listForwards(): Promise<ForwardsObject[]> {
        return this.client.listForwards(this.id);
    }

    reverse(local: string, remote: string): Promise<void> {
        return this.client.reverse(this.id, local, remote);
    }

    listReverses(): Promise<ReversesObject[]> {
        return this.client.listReverses(this.id);
    }

    shell(command: string): Promise<string> {
        return this.client.shell(this.id, command);
    }

    reboot(): Promise<void> {
        return this.client.reboot(this.id);
    }

    shutdown(): Promise<void> {
        return this.client.shutdown(this.id);
    }

    remount(): Promise<void> {
        return this.client.remount(this.id);
    }

    root(): Promise<void> {
        return this.client.root(this.id);
    }

    screenshot(): Promise<Buffer> {
        return this.client.screenshot(this.id);
    }

    openTcp(port: number | string, host?: string): Promise<Connection> {
        return this.client.openTcp(this.id, port, host as string);
    }

    openLogcat(options?: LogcatOptions): Promise<LogcatReader> {
        return this.client.openLogcat(this.id, options as LogcatOptions);
    }

    clear(pkg: string): Promise<void> {
        return this.client.clear(this.id, pkg);
    }

    install(apk: string | Readable): Promise<void>;
    install(apk: string | Readable, options?: InstallOptions): Promise<void>;
    install(
        apk: string | Readable,
        options?: InstallOptions,
        args?: string
    ): Promise<void>;
    install(
        apk: string | Readable,
        options?: InstallOptions,
        args?: string
    ): Promise<void> {
        // TODO double check type cast
        return this.client.install(
            this.id,
            apk,
            options as InputOptions,
            args as string
        );
    }

    uninstall(pkg: string, options?: UninstallOptions): Promise<void> {
        return this.client.uninstall(this.id, pkg, options as UninstallOptions);
    }

    isInstalled(pkg: string): Promise<boolean> {
        return this.client.isInstalled(this.id, pkg);
    }

    startActivity(
        pkg: string,
        activity: string,
        options?: StartActivityOptions
    ): Promise<void> {
        return this.client.startActivity(
            this.id,
            pkg,
            activity,
            options as StartActivityOptions
        );
    }

    startService(
        pkg: string,
        service: string,
        options?: StartServiceOptions
    ): Promise<void> {
        return this.client.startService(
            this.id,
            pkg,
            service,
            options as StartActivityOptions
        );
    }

    readDir(path: string): Promise<SyncEntry[]> {
        return this.client.readDir(this.id, path);
    }

    pushDataToFile(data: string, destPath: string): Promise<void> {
        return this.client.pushDataToFile(this.id, data, destPath);
    }

    pushFile(srcPath: string, destPath: string): Promise<void> {
        return this.client.pushFile(this.id, srcPath, destPath);
    }

    pullDataFromFile(srcPath: string): Promise<Buffer> {
        return this.client.pullDataFromFile(this.id, srcPath);
    }

    pullFile(srcPath: string, destPath: string): Promise<void> {
        return this.client.pullFile(this.id, srcPath, destPath);
    }

    pull(path: string): Promise<PullTransfer> {
        return this.client.pull(this.id, path);
    }

    push(
        srcPath: string | Readable,
        destPath: string,
        mode?: SyncMode | ExecCallbackWithValue<PushTransfer>
    ): Promise<PushTransfer> {
        return this.client.push(this.id, srcPath, destPath, mode as SyncMode);
    }

    tcpip(port = 5555): Promise<void> {
        return this.client.tcpip(this.id, port);
    }

    usb(): Promise<void> {
        return this.client.usb(this.id);
    }

    waitBootComplete(): Promise<void> {
        return this.client.waitBootComplete(this.id);
    }

    listSettings(
        mode: SettingsMode,
        cb?: ExecCallbackWithValue<PrimitiveDictionary>
    ) {
        return this.client.listSettings(this.id, mode, cb);
    }

    getProp(prop: string, cb?: (err: Error, value: PrimitiveType) => void) {
        return this.client.getProp(this.id, prop, cb);
    }

    setProp(
        prop: string,
        value: PrimitiveType,
        cb?: ExecCallback
    ): Promise<void> {
        return this.client.setProp(this.id, prop, value, cb);
    }

    getSetting(
        mode: SettingsMode,
        name: string,
        cb?: (err: Error, value: PrimitiveType) => void
    ) {
        return this.client.getSetting(this.id, mode, name, cb);
    }

    putSetting(
        mode: SettingsMode,
        name: string,
        value: PrimitiveType,
        cb?: ExecCallback
    ) {
        return this.client.putSetting(this.id, mode, name, value, cb);
    }

    tap(x: number, y: number, cb?: ExecCallback): Promise<void>;
    tap(
        x: number,
        y: number,
        source: InputSource,
        cb?: ExecCallback
    ): Promise<void>;
    tap(x: number, y: number, source: any, cb?: ExecCallback) {
        return this.client.tap(this.id, x, y, source, cb);
    }

    text(text: PrimitiveType, cb?: ExecCallback): Promise<void>;
    text(
        text: PrimitiveType,
        source: InputSource,
        cb?: ExecCallback
    ): Promise<void>;
    text(text: PrimitiveType, source: any, cb?: ExecCallback) {
        return this.client.text(this.id, text, source, cb);
    }

    keyEvent(code: KeyCode | number, cb?: ExecCallback): Promise<void>;
    keyEvent(
        code: KeyCode | number,
        options?: InputOptions & { longpress?: boolean },
        cb?: ExecCallback
    ): Promise<void>;
    keyEvent(code: KeyCode | number, options?: any, cb?: ExecCallback) {
        return this.client.keyEvent(this.id, code, options, cb);
    }

    swipe(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        cb?: ExecCallback
    ): Promise<void>;
    swipe(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: InputOptions & { duration?: number },
        cb?: ExecCallback
    ): Promise<void>;
    swipe(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: any,
        cb?: ExecCallback
    ) {
        return this.client.swipe(this.id, x1, y1, x2, y2, options, cb);
    }

    dragAndDrop(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        cb?: ExecCallback
    ): Promise<void>;
    dragAndDrop(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: InputOptions & { duration?: number },
        cb?: ExecCallback
    ): Promise<void>;
    dragAndDrop(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: any,
        cb?: ExecCallback
    ) {
        return this.client.dragAndDrop(this.id, x1, y1, x2, y2, options, cb);
    }

    press(cb?: ExecCallback): Promise<void>;
    press(source?: InputSource, cb?: ExecCallback): Promise<void>;
    press(source: any, cb?: ExecCallback) {
        return this.client.press(this.id, source, cb);
    }

    roll(x: number, y: number, cb?: ExecCallback): Promise<void>;
    roll(
        x: number,
        y: number,
        source?: InputSource,
        cb?: ExecCallback
    ): Promise<void>;
    roll(x: number, y: number, source: any, cb?: ExecCallback) {
        return this.client.roll(this.id, x, y, source, cb);
    }

    custom<T>(
        CustomCommand: CommandConstruct,
        cb?: (err: Error, value: T) => void
    ) {
        return this.client.customTransport<T>(CustomCommand, this.id, cb);
    }

    openMonkey(cb?: (err: Error, value: Monkey) => void) {
        return this.client.openMonkey(this.id, cb);
    }

    killApp(pkg: string, cb?: ExecCallback) {
        return this.client.killApp(this.id, pkg, cb);
    }

    exec(cmd: string, cb?: ExecCallbackWithValue<string>) {
        return this.client.execDevice(this.id, cmd, cb);
    }

    execShell(cmd: string, cb?: ExecCallbackWithValue<string>) {
        return this.client.execDeviceShell(this.id, cmd, cb);
    }

    batteryStatus(cb?: ExecCallbackWithValue<PrimitiveDictionary>) {
        return this.client.batteryStatus(this.id, cb);
    }

    rm(
        path: string,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    rm(
        path: string,
        options?: RmOptions,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    rm(
        path: string,
        options?: any,
        cb?: (err: Error | null, value: string) => void
    ) {
        return this.client.rm(this.id, path, options, cb);
    }

    mkdir(
        path: string,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    mkdir(
        path: string,
        options?: MkDirOptions,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    mkdir(
        path: string,
        options?: any,
        cb?: (err: Error | null, value: string) => void
    ) {
        return this.client.mkdir(this.id, path, options, cb);
    }

    touch(
        path: string,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    touch(
        path: string,
        options?: TouchOptions,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    touch(
        path: string,
        options?: any,
        cb?: (err: Error | null, value: string) => void
    ) {
        return this.client.touch(this.id, path, options, cb);
    }

    mv(
        srcPath: string,
        destPath: string,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    mv(
        srcPath: string,
        destPath: string,
        options?: MvOptions,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    mv(
        srcPath: string,
        destPath: string,
        options?: any,
        cb?: (err: Error | null, value: string) => void
    ) {
        return this.client.mv(this.id, srcPath, destPath, options, cb);
    }

    cp(
        srcPath: string,
        destPath: string,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    cp(
        srcPath: string,
        destPath: string,
        options?: CpOptions,
        cb?: (err: Error | null, value: string) => void
    ): Promise<string>;
    cp(
        srcPath: string,
        destPath: string,
        options?: any,
        cb?: (err: Error | null, value: string) => void
    ) {
        return this.client.cp(this.id, srcPath, destPath, options, cb);
    }

    fileStat(path: string, cb?: (err: Error | null, value: FileStat) => void) {
        return this.client.fileStat(this.id, path, cb);
    }
}
