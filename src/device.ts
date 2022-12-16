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
import Stats from './sync/stats';
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

    getSerialNo(cb?: ExecCallbackWithValue<string>): Promise<string> | void {
        return this.client.getSerialNo(
            this.id,
            cb as NonNullable<ExecCallbackWithValue<string>>
        );
    }

    getDevicePath(cb?: ExecCallbackWithValue<string>): Promise<string> | void {
        return this.client.getDevicePath(
            this.id,
            cb as NonNullable<ExecCallbackWithValue<string>>
        );
    }

    listProperties(
        cb?: ExecCallbackWithValue<DataMap>
    ): Promise<DataMap> | void {
        return this.client.listProperties(
            this.id,
            cb as NonNullable<ExecCallbackWithValue<DataMap>>
        );
    }

    listFeatures(cb?: ExecCallbackWithValue<DataMap>): Promise<DataMap> | void {
        return this.client.listFeatures(
            this.id,
            cb as NonNullable<ExecCallbackWithValue<DataMap>>
        );
    }

    listPackages(
        cb?: ExecCallbackWithValue<string[]>
    ): Promise<string[]> | void {
        return this.client.listPackages(
            this.id,
            cb as NonNullable<ExecCallbackWithValue<string[]>>
        );
    }

    getIpAddress(
        cb?: ExecCallbackWithValue<string | string[] | null>
    ): Promise<string | string[] | null> | void {
        return this.client.getIpAddress(
            this.id,
            cb as NonNullable<ExecCallbackWithValue<string | string[] | null>>
        );
    }

    forward(local: string, remote: string, cb?: ExecCallback) {
        return this.client.forward(
            this.id,
            local,
            remote,
            cb as NonNullable<ExecCallback>
        );
    }

    listForwards(
        cb?: ExecCallbackWithValue<ForwardsObject[]>
    ): Promise<ForwardsObject[]> | void {
        return this.client.listForwards(
            this.id,
            cb as NonNullable<ExecCallbackWithValue<ForwardsObject[]>>
        );
    }

    reverse(
        local: string,
        remote: string,
        cb?: ExecCallback
    ): Promise<void> | void {
        return this.client.reverse(
            this.id,
            local,
            remote,
            cb as NonNullable<ExecCallback>
        );
    }

    listReverses(
        cb?: ExecCallbackWithValue<ReversesObject[]>
    ): Promise<ReversesObject[]> | void {
        return this.client.listReverses(
            this.id,
            cb as NonNullable<ExecCallbackWithValue<ReversesObject[]>>
        );
    }

    shell(
        command: string,
        cb?: ExecCallbackWithValue<string>
    ): Promise<string> | void {
        return this.client.shell(
            this.id,
            command,
            cb as NonNullable<ExecCallbackWithValue<string>>
        );
    }

    reboot(cb?: ExecCallback): Promise<void> | void {
        return this.client.reboot(this.id, cb as NonNullable<ExecCallback>);
    }

    shutdown(cb?: ExecCallback): Promise<void> | void {
        return this.client.shutdown(this.id, cb as NonNullable<ExecCallback>);
    }

    remount(cb?: ExecCallback): Promise<void> | void {
        return this.client.remount(this.id, cb as NonNullable<ExecCallback>);
    }

    root(cb?: ExecCallback): Promise<void> | void {
        return this.client.root(this.id, cb as NonNullable<ExecCallback>);
    }

    screenshot(cb?: ExecCallbackWithValue<Buffer>): Promise<Buffer> | void {
        return this.client.screenshot(
            this.id,
            cb as NonNullable<ExecCallbackWithValue<Buffer>>
        );
    }

    openTcp(
        port: number | string,
        cb?: ExecCallbackWithValue<Connection>
    ): Promise<Connection> | void;
    openTcp(
        port: number | string,
        host?: string,
        cb?: ExecCallbackWithValue<Connection>
    ): Promise<Connection> | void;
    openTcp(
        port: number | string,
        host?: any,
        cb?: ExecCallbackWithValue<Connection>
    ): Promise<Connection> | void {
        return this.client.openTcp(
            this.id,
            port,
            host,
            cb as NonNullable<ExecCallbackWithValue<Connection>>
        );
    }

    openLogcat(
        cb?: ExecCallbackWithValue<LogcatReader>
    ): Promise<LogcatReader> | void;
    openLogcat(
        options?: LogcatOptions,
        cb?: ExecCallbackWithValue<LogcatReader>
    ): Promise<LogcatReader> | void;
    openLogcat(
        options?: any,
        cb?: ExecCallbackWithValue<LogcatReader>
    ): Promise<LogcatReader> | void {
        return this.client.openLogcat(
            this.id,
            options,
            cb as NonNullable<ExecCallbackWithValue<LogcatReader>>
        );
    }

    clear(pkg: string, cb?: ExecCallback): Promise<void> | void {
        return this.client.clear(this.id, pkg, cb as NonNullable<ExecCallback>);
    }

    install(apk: string | Readable, cb?: ExecCallback): Promise<void> | void;
    install(
        apk: string | Readable,
        options?: InstallOptions,
        cb?: ExecCallback
    ): Promise<void> | void;
    install(
        apk: string | Readable,
        options?: InstallOptions,
        args?: string,
        cb?: ExecCallback
    ): Promise<void> | void;
    install(
        apk: string | Readable,
        options?: InstallOptions | ExecCallback,
        args?: string | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        // TODO double check type cast
        return this.client.install(
            this.id,
            apk,
            options as InputOptions,
            args as string,
            cb as NonNullable<ExecCallback>
        );
    }

    uninstall(pkg: string, cb?: ExecCallback): Promise<void> | void;
    uninstall(
        pkg: string,
        options?: UninstallOptions,
        cb?: ExecCallback
    ): Promise<void> | void;
    uninstall(
        pkg: string,
        options?: UninstallOptions | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        return this.client.uninstall(
            this.id,
            pkg,
            options as UninstallOptions,
            cb as NonNullable<ExecCallback>
        );
    }

    isInstalled(
        pkg: string,
        cb?: ExecCallbackWithValue<boolean>
    ): Promise<boolean> | void {
        return this.client.isInstalled(
            this.id,
            pkg,
            cb as NonNullable<ExecCallbackWithValue<boolean>>
        );
    }

    startActivity(
        pkg: string,
        activity: string,
        cb?: ExecCallback
    ): Promise<void> | void;
    startActivity(
        pkg: string,
        activity: string,
        options?: StartActivityOptions,
        cb?: ExecCallback
    ): Promise<void> | void;
    startActivity(
        pkg: string,
        activity: string,
        options?: StartActivityOptions | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        // TODO check casting
        return this.client.startActivity(
            this.id,
            pkg,
            activity,
            options as StartActivityOptions,
            cb as NonNullable<ExecCallback>
        );
    }

    startService(
        pkg: string,
        service: string,
        cb?: ExecCallback
    ): Promise<void> | void;
    startService(
        pkg: string,
        service: string,
        options?: StartServiceOptions,
        cb?: ExecCallback
    ): Promise<void> | void;
    startService(
        pkg: string,
        service: string,
        options?: StartServiceOptions | ExecCallback,
        cb?: ExecCallback
    ): Promise<void> | void {
        // TODO check casting
        return this.client.startService(
            this.id,
            pkg,
            service,
            options as StartActivityOptions,
            cb as NonNullable<ExecCallback>
        );
    }

    readDir(path: string, cb?: (err: Error, value: SyncEntry[]) => void) {
        return this.client.readDir(this.id, path, cb);
    }

    pushDataToFile(data: string, destPath: string, cb?: ExecCallback) {
        return this.client.pushDataToFile(this.id, data, destPath, cb);
    }

    pushFile(srcPath: string, destPath: string, cb?: ExecCallback) {
        return this.client.pushFile(this.id, srcPath, destPath, cb);
    }

    pullDataFromFile(srcPath: string, cb?: ExecCallbackWithValue<string>) {
        return this.client.pullDataFromFile(this.id, srcPath, cb);
    }

    pullFile(srcPath: string, destPath: string, cb?: ExecCallback) {
        return this.client.pullFile(this.id, srcPath, destPath, cb);
    }

    pull(path: string, cb?: (err: Error, value: PullTransfer) => void) {
        return this.client.pull(this.id, path, cb);
    }

    push(
        srcPath: string | Readable,
        destPath: string,
        cb?: (err: Error, value: PushTransfer) => void
    ): Promise<PushTransfer>;
    push(
        srcPath: string | Readable,
        destPath: string,
        mode?: SyncMode,
        cb?: (err: Error, value: PushTransfer) => void
    ): Promise<PushTransfer>;
    push(
        srcPath: string | Readable,
        destPath: string,
        mode?: any,
        cb?: (err: Error, value: PushTransfer) => void
    ) {
        return this.client.push(this.id, srcPath, destPath, mode, cb);
    }

    tcpip(port = 5555, cb?: ExecCallbackWithValue<string>) {
        return this.client.tcpip(this.id, port, cb);
    }

    usb(cb?: ExecCallback) {
        return this.client.usb(this.id, cb);
    }

    waitBootComplete(cb?: ExecCallback) {
        return this.client.waitBootComplete(this.id, cb);
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
