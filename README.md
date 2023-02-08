# adb-ts

Module handling adb functionality, inspired by [adbkit](https://www.npmjs.com/package/adbkit), [adbkit-monkey](https://www.npmjs.com/package/adbkit-monkey) and [adbkit-logcat](https://www.npmjs.com/package/adbkit-logcat). This module removes its deprecated api, includes bug fixes, TS support and more convenient functions and syntax as well as easy scalability for custom functionalities.

Developed and tested with Android Debug Bridge version 1.0.41
Version 29.0.5-5949299.

## Installation

```bash
yarn add adb-ts
```

## API

- **AdbClient(options?: AdbClientOptions)**
- **options?** Optional callback function:
  - `bin: string`: path to adb.exe, if not set, env path is taken
  - `noAutoStart: boolean`: if false, module will not attempt to start adb server
  - `host: string`: default `localhost`
  - `port: number`: default `5037`

```ts
import { AdbClient } from 'adb-ts';
const adb = new AdbClient({ bin: 'path-to-adb.exe' });
```

#### adb methods

##### adb.version(cb?: (err: Error, value: number) => void)

```ts
adb.version().then((version: number) => console.log(version));
```

Gets the adb server version.

- Returns: `Promise<number>`

##### adb.map<R>(mapper: (device: AdbDevice) => R)

```ts
adb.map(async (device: AdbDevice) => {
  const props = await device.listProperties();
});
```

Maps through all devices. In the mapper function, instance of `AdbDevice` is available. `AdbDevice` has properties `id` , `state` , `path` , `device` , `model` , `product` , `transport` and `transportId` .
Snippet above is equivalent to:

```ts
adb.listDevices().then((devices) => {
  return Promise.map(devices, async (device) => {
    const props = await adb.listProperties(device.id);
  });
});
```

- Returns: `Promise<R[]>`

##### adb.connect(host: string, port = 5555)

```ts
adb.map(async (device) => {
  await device.tcpip();
  await adb.waitForDevice('usb', 'device');
  const ip = await device.getIpAddress();
  await adb.connect(ip);
});
```

Connects to device over local network.

- Returns: `Promise<string>` device id

##### adb.disconnect(host: string, port = 5555, cb?: (err: Error, value: string) => void)

```ts
adb.connect('192.168.1.10').then((id: string) => console.log(id));
```

Disconnects from the given device.

- Returns: `Promise<string>` device id

##### adb.listDevices(cb?: (err: Error, value: IAdbDevice[]) => void)

```ts
adb.listDevices().then((devices: IAdbDevice[]) => console.log(devices));
```

Gets the list of currently connected devices and emulators.

- Returns: `Promise<IAdbDevice[]>`

##### adb.trackDevices(cb?: (err: Error, value: Tracker) => void)

```ts
adb.trackDevices().then((tracker: Tracker) => {
  tracker.on('add', (device) => {
    // ...
  });
  tracker.end();
});
```

Return instance of `Tracker` extending `EventEmitter` , which can emit events `add` , `remove` , `change` , `end` or `error` .

- Returns: `Promise<Tracker>`

##### adb.kill(cb?: (err: Error) => void)

```ts
adb.kill().then(() => null);
```

Kills the adb server.

- Returns: `Promise<void>`

##### adb.exec(...args: ReadonlyArray<string>)

```ts
adb.exec('devices').then((output: string) => console.log(output));
```

Executes a given command via adb console interface.

- Returns: `Promise<string>`

##### adb.custom<T>(CustomCommand: CommandConstruct, cb?: (err: Error, value: T) => void)

Enables to execute any custom command. Provided parameter has to extend the `Command` class.

```ts
// gets adb version
class MyCommand extends Command {
  execute() {
    return super.execute('host:version').then((reply) => {
      switch (reply) {
        case Reply.OKAY:
          return this.parser.readValue().then((value) => {
            return parseInt(value.toString(), 10);
          });
        case Reply.FAIL:
          return this.parser.readError();
        default:
          return parseInt(reply, 10);
      }
    });
  }
}
adb.custom<number>(MyCommand).then((value) => {
  console.log(value);
});
```

Execute method `ParseCommand` instance will call overridden `parse` method.
Execute method `RawCommand` resolves with socket connection to the adb server.
Custom Transport command to be executed on a particular device:

#### adb device functions

##### device.getSerialNo(cb?: (err: Error, value: string) => void)

```ts
device.getSerialNo().then((id: string) => console.log(id));
```

Gets the serial number of the device. Meant for getting serial number of local devices. Analogous to `adb shell getprop ro.serialno` .

- Returns: `Promise<string>`

##### device.getDevicePath(cb?: (err: Error, value: string) => void)

```ts
device.getDevicePath().then((path: string) => console.log(path));
```

Gets the device path of the device identified by the device.

- Returns: `Promise<string>`

##### device.listProperties(cb?: (err: Error, value: KeyStringObject) => void)

```ts
device
  .listProperties()
  .then((properties: KeyStringObject) => console.log(properties));
```

Gets the device properties. Analogous to `adb shell getprop` .

- Returns: `Promise<KeyStringObject>`

##### device.listFeatures(cb?: (err: Error, value: KeyStringObject) => void)

```ts
device
  .listFeatures()
  .then((features: KeyStringObject) => console.log(features));
```

Gets the device features. Analogous to `adb shell pm list features` .

- Returns: `Promise<KeyStringObject>`

##### device.listPackages(cb?: (err: Error, value: string[]) => void)

```ts
device.listPackages().then((packages: string[]) => console.log(packages));
```

Gets the installed packages. Analogous to `adb shell pm list packages` .

- Returns: `Promise<string[]>`

##### device.getIpAddress(serial: string)

```ts
device.getIpAddress(cb?: (err: Error, value: string | null) => void)
    .then((ipadd: string | null) => console.log(ipadd));
```

Gets the the ip address of default wlan interface. If device has no ip address assigned, returns `null` .

- Returns: `Promise<string | null>`

##### device.forward(serial: string, local: string, remote: string)

```ts
device
  .forward('tcp:9222', 'localabstract:chrome_devtools_remote')
  .then(() => null);
```

Forwards socket connections from the ADB server host (local) to the device (remote). Analogous to `adb forward <local> <remote>` .

- **local** The local endpoint on the ADB host in one of the following formats:
  - `tcp:<port>`
  - `localabstract:<unix domain socket name>`
  - `localreserved:<unix domain socket name>`
  - `localfilesystem:<unix domain socket name>`
  - `dev:<character device name>`
- **remote** The remote endpoint on the device.

- Returns: `Promise<void>`

##### device.listForwards(cb?: (err: Error, value: ForwardsObject[]) => void)

```ts
device.listForwards().then((list: ForwardsObject[]) => console.log(list));
```

Lists all forwarded connections. Analogous to `adb forward --list` .

- Returns: `Promise<ForwardsObject[]>`

##### device.reverse(local: string, remote: string, cb?: (err: Error) => void)

```ts
device
  .reverse('localabstract:chrome_devtools_remote', 'tcp:9222')
  .then(() => null);
```

Reverses socket connections from the device (remote) to the ADB server host (local). Analogous to `adb reverse <remote> <local>` ;

- **remote** The remote endpoint on the device in one of the following formats:
  - `tcp:<port>`
  - `localabstract:<unix domain socket name>`
  - `localreserved:<unix domain socket name>`
  - `localfilesystem:<unix domain socket name>`
  - `dev:<character device name>`
- **local** The local endpoint on the ADB host.

- Returns: `Promise<void>`

##### device.listReverses(cb?: (err: Error, value: ReversesObject[]) => void)

```ts
device.listReverses().then((list: ReversesObject[]) => console.log(list));
```

Lists all reversed connections. Analogous to `adb reverse --list` .

- Returns: `Promise<ReversesObject[]>`

##### device.shell(command: string | string[], cb?: (err: Error, value: SimpleType) => void)

```ts
device.shell('ip route').then((value: SimpleType) => console.log(value));
```

Executes a shell command on the device. Analogous to `adb shell 'command'` ;

Parses the output to native type.

- Returns: `Promise<SimpleType>` output

##### device.reboot(cb?: (err: Error) => void)

```ts
device.reboot().then(() => null);
```

Reboots the device. Analogous to `adb reboot` .

- Returns: `Promise<void>`

##### device.shutdown(cb?: (err: Error) => void)

```ts
device.shutdown().then(() => null);
```

Shuts the device down. Analogous to `adb reboot -p` .

- Returns: `Promise<void>`

##### device.remount(cb?: (err: Error) => void)

```ts
device.remount().then(() => null);
```

Attempts to remount the /system partition in read-write mode. Can be done on a rooted device. Analogous to `adb remount` .

- Returns: `Promise<void>`

##### device.root(serial: string)

```ts
device.root().then(() => null);
```

Attempts to which the device to the root mode. Analogous to `adb root` .

- Returns: `Promise<void>`

##### device.screenshot(cb?: (err: Error, value: Jimp) => void)

```ts
device.screenshot().then((image: Jimp) => {
  image.write('some-image.jpg');
});
```

Gets a screenshot on the specified device. See [Jimp](https://www.npmjs.com/package/jimp) for fot its API.

- Returns: `Promise<Jimp>`

##### device.openTcp(port: number | string, host?: string, cb?: (err: Error, value: Connection) => void)

```ts
device.openTcp(5555).then((socket: Connection) => {
  // socket.write(...)
});
```

Opens a direct TCP connection to a port on the device, without any port forwarding required. Analogous to `adb tcp <port>:<host>` .

- Returns: `Promise<Connection>`

##### device.openLogcat(options?: LogcatOptions, cb?: (err: Error, value: LogcatReader) => void)

```ts
device
  .openLogcat({
    filter: (entry) =>
      entry.message.includes('some string') &&
      entry.prioritiy >= Priority.FATAL,
  })
  .then((reader: LogcatReader) => {
    reader.on('entry', (entry) => {
      console.log(entry);
    });
    // ...
    reader.end();
  });
```

Returns a `LogcatReader` instance. Enables to set `filter` option for cleaner filtering of the incoming logs. e.g. `filter: (entry) => entry.message.includes('some string')` is roughly similar to `adb logcat | grep 'some string'` .
`LogcatReader` is a class extending `EventEmitter` and emitting events `entry` , `end` , `finish` or `error` .

- Returns: `Promise<LogcatReader>`

##### device.clear(pkg: string, cb?: (err: Error) => void)

```ts
device.clear().then(() => null);
```

Deletes all data associated with a package from the device. Analogous to `adb shell pm clear <pkg>` .

- Returns: `Promise<void>`

##### device.install(apk: string | Readable, options?: InstallOptions, cb?: (err: Error) => void)

```ts
device.install('path-to-apk', { test: true }).then(() => null);
```

- **options?: InstallOptions**:

  - **reinstall?: boolean**: adds `-r` flag to the install command
  - **test?: boolean**: adds `-t` flag to the install command
  - **internal?: boolean**: adds `-f` flag to the install command
  - **allowDowngrade?: boolean**: adds `-d` flag to the install command
  - **grandPermissions?: boolean**: adds `-g` flag to the install

  command

- **args?: string**:

  - e.g. `--fastdeploy` flag

Installs an apk to the device. Analogous to `adb install` .

- Returns: `Promise<void>`

##### device.uninstall(pkg: string, options?: UninstallOptions, cb?: (err: Error) => void)

```ts
device.uninstall('pkg').then(() => null);
```

- **options?: InstallOptions**:
  - **keepCache?: boolean**: adds `-k` flag to the install command

Uninstalls a package from the device. Analogous to `adb uninstall` .

- Returns: `Promise<void>`

##### device.isInstalled(pkg: string, options?: UninstallOptions, cb?: (err: Error) => void)

```ts
device.isInstalled('pkg').then((result: boolean) => console.log(result));
```

- **pkg: string**: package name to examine

Tells if a package is installed or not.

- Returns: `Promise<boolean>`

#### device.startService(pkg: string, service: string, options?: StartServiceOptions, cb?: (err: Error) => void)

```ts
device
  .startService('com.some.package', 'SomeService', {
    flags: '-f',
    extras: {
      key: 'name',
      value: '0',
      type: 'string',
    },
  })
  .then(() => null);
```

- **options:**
- **user?: number | string**: default `0`
- **action?: string**: adds `-a` flag, action
- **data?: string**: adds `-d` flag, Optional data
- **mimeType: boolean**: adds `-t` flag
- **category: string | string[]**: adds `-c` flag, string or string array

- **flags: AdbFlag | AdbFlag[]** values: `'-f' | '-d' | '-e' | '-g' | '-k' | '-s' | '-t' | '-3' | '-i' | '-u'`

- **extras: AdbExtra | AdbExtra[]**

`AdbExtra` is an object:
`key: string`

`type: AdbExtraType = 'string' | 'null' | 'bool' | 'int' | 'long' | 'float' | 'uri' | 'component'`

`value: SimpleType | SimpleType[]`

Starts a new activity with options. Extras data type needs to be defined separately in the `type` property.

- Returns: `Promise<void>`

#### device.startActivity(pkg: string, activity: string, options?: StartActivityOptions, cb?: (err: Error) => void)

```ts
device
  .startActivity('com.some.package', 'SomeActivity', { debug: true })
  .then(() => null);
```

- **debug: boolean**: adds `-D` flag, enables debugging
- **wait: boolean**: adds `-W` flag, resolves once activity was successfully started

For other options see `startService` .

Starts a new activity with options.

- Returns: `Promise<void>`

#### device.stat(path: string, cb?: (err: Error, value: Stats) => void)

```ts
device.stat('/path/on/device').then((value: Stats) => {});
```

Return instance of `Stats` , object extending `fs.Stats` .

- Returns: `Promise<Stats>`.

#### device.readDir(cb?: (err: Error, value: SyncEntry[]) => void)

```ts
device.readDir('/path/on/device').then((entries: SyncEntry[]) => {});
```

Return array of `SyncEntry` , object extending `Stats` .
Note, the path should start with a slash.

- Returns: `Promise<SyncEntry[]>`.

### File system methods

#### device.pull(cb?: (err: Error, value: PullTransfer) => void)

```ts
device.pull('/path/on/device').then((transfer: PullTransfer) => {
  transfer.on('data', (chunk) => {
    data += chunk.toString();
  });
  transfer.on('end', () => {
    console.log(data);
  });
});
```

Returns instance of `PullTransfer` extending `Stream.PassThrough` , which can emit events `end` , `data` , `close` , `pause` , `readable` , `resume` , `progress` or `error` .
Generally it is more convenient to use `pullFile()` or `pullDataFromFile()` methods.

- Returns: `Promise<PullTransfer>`.

#### device.pullFile(srcPath: string, destPath: string, cb?: (err: Error) => void)

```ts
device.pullFile('/path/on/device', 'output.txt').then(() => null);
```

- **srcPath: string**: path to file on the device to be read
- **destPath: boolean**: path to desired output file on the host

Wraps `pull()` method, reads the content of file on the device to a file on the machine.

- Returns: `Promise<void>`

#### device.pullDataFromFile(srcPath: string, cb?: (err: Error, value: string) => void)

```ts
device
  .pullDataFromFile('/path/on/device')
  .then((output: string) => console.log(output));
```

- **srcPath: string**: path to file on the device to be read

Wraps `pull()` method, reads the file content and resolves with the output.

- Returns: `Promise<string>`.

#### device.push( srcPath: string | Readable, destPath: string, mode?: SyncMode, cb?: (err: Error, value: PushTransfer) => void)

```ts
device.push('path-to-src', '/path/on/device').then((transfer: PushTransfer) => {
  transfer.on('end', () => {});
});
```

Return instance of `PushTransfer` extending `EventEmitter` , which can emit events `end` , `cancel` , `progress` or `error` .
Generally it is more convenient to use `pushFile` or `pushDataToFile` methods.

- Returns: `Promise<PushTransfer>`.

#### device.pushFile(src: string, dest: string, cb?: (err: Error) => void)

```ts
device.pushFile('path-to-source', '/path/on/device').then(() => null);
```

- **srcPath: string**: path to file on the host to be written
- **destPath: boolean**: path to file on the device

Wraps `push()` method, reads the content of file on the host to a file on the device.

- Returns: `Promise<void>`

#### device.pushDataToFile(data: string, destPath: string, cb?: (err: Error) => void)

```ts
device
  .pushDataToFile('contents', '/path/on/device')
  .then((output: string) => console.log(output));
```

- **data: string**: string to be written
- **destPath: string**: path to file on the device

Wraps `push()` method, provides API for quick data writing.

- Returns: `Promise<void>`

#### device.tcpip(port = 5555, cb?: (err: Error, value: string) => void)

```ts
device.tcpip().then(() => null);
```

Puts the device's ADB daemon into tcp mode. Afterwards it is possible to use `connect` method. Analogous to `adb tcpip 5555` . Resolves with port number.

- Returns: `Promise<string>`

##### device.usb(cb?: (err: Error) => void)

```ts
device.usb().then(() => null);
```

Puts to device transport back to usb.

- Returns: `Promise<void>`

##### device.waitBootComplete( cb?: (err: Error) => void)

```ts
adb.trackDevices((err, tracker) => {
  tracker.on('add', (device) => {
    device.waitBootComplete().then(() => {});
  });
});
```

Waits until the device has finished booting.

- Returns: `Promise<void>`

##### device.waitForDevice(transport: TransportType, state: WaitForState, cb?: (err: Error) => void)

```ts
adb.trackDevices((err, tracker) => {
  tracker.on('add', (device) => {
    device.waitForDevice().then(() => {});
  });
});
```

Waits until the device is recognized by adb.

- Returns: `Promise<void>`

##### device.listSettings(mode: SettingsMode, cb?: (err: Error, value: KeyStringObject) => void)

```ts
device
  .listSettings('system')
  .then((settings: KeyStringObject) => console.log(settings));
```

- **mode: SettingsMode**: values `system`, `global` or `secure`.

Gets the device features. Analogous to `adb shell settings list system <mode>` .

- Returns: `Promise<KeyStringObject>`

##### device.getProp(prop: string, cb?: (err: Error, value: SimpleType) => void)

```ts
device
  .getProp('ro.build.version.sdk')
  .then((value: SimpleType) => console.log(value));
```

Gets the device features. Analogous to `adb shell getprop <propname>` .

- Returns: `Promise<SimpleType>`

##### device.getSetting(mode: SettingsMode, name: string, cb?: (err: Error, value: SimpleType) => void)

```ts
device
  .getSetting('global', 'wifi_on')
  .then((value: SimpleType) => console.log(value));
```

Gets the device features. Analogous to `adb shell settings get <mode> <name>` .

- Returns: `Promise<SimpleType>`

##### device.putSetting(mode: SettingsMode, name: string, value: SimpleType, cb?: (err: Error) => void)

```ts
device.putSetting('global', 'wifi_on', 0).then(() => null);
```

Gets the device features. Analogous to `adb shell settings put <mode> <name> <value>` .

- Returns: `Promise<void>`

##### device.killApp(pkg: string, cb?: (err: Error) => void)

```ts
device.killApp('com.some.package').then(() => null);
```

Gets the device features. Analogous to `adb shell am force-stop <package>` .

- Returns: `Promise<void>`

#### Input methods

Note: for multiple input it is more efficient to use [`Monkey`](https://github.com/Maaaartin/adb-ts#adb-monkey).

##### device.roll(x: number, y: number, source: InputSource = 'trackball')

```ts
device.roll(100, 0).then(() => null);
```

- **x** Horizontal coordinate
- **y** Vertical coordinate
- **source** Optional parameter of `InputSource`. Default `trackball`

Send roll input command to the device shell. Analogous to `adb shell input trackball roll x y` .

- Returns: `Promise<void>`

##### device.press(source: InputSource = 'trackball')

```ts
device.press().then(() => null);
```

- **source** Optional parameter of `InputSource`. Default `trackball`

Send roll input command to the device shell. Analogous to `adb shell input trackball press` .

- Returns: `Promise<void>`

##### device.dragAndDrop(x1: number, y2: number, x1: number, y2: number, options?: InputOptions & { duration?: number })

```ts
device.dragAndDrop(100, 0, 200, 10, { duration: 3000 }).then(() => null);
```

- **x1** Horizontal starting coordinate
- **y1** Vertical starting coordinate
- **x2** Horizontal ending coordinate
- **y2** Vertical ending coordinate
- **options** Optional parameter of `InputOptions`.

  - **duration?** Duration of the action in ms.
  - **source?:** Default `touchscreen` .

Send roll input command to the device shell. Analogous to `adb shell input touchscreen draganddrop x1 y1 x2 y2` .

- Returns: `Promise<void>`

##### device.swipe(x1: number, y2: number, x1: number, y2: number, options?: InputOptions & { duration?: number })

```ts
device.swipe(100, 0, 200, 10, { duration: 3000 }).then(() => null);
```

- **x1** Horizontal starting coordinate
- **y1** Vertical starting coordinate
- **x2** Horizontal ending coordinate
- **y2** Vertical ending coordinate
- **options** Optional parameter of `InputOptions`.

  - **duration?** Duration of the action in ms.
  - **source?:** Default `touchscreen` .

Send swipe input command to the device shell. Analogous to `adb shell input touchscreen swipe x1 y1 x2 y2` .

- Returns: `Promise<void>`

##### device.keyEvent(code: KeyCode | number, options?: InputOptions & { longpress?: boolean })

```ts
device.keyEvent(KeyCode.KEYCODE_HOME).then(() => null);
```

- **code** Key code number
- **options** Optional parameter of `InputOptions`.

  - **longpress?** Longpress flag `--longpress` .
  - **source?:** Default `keyboard` .

Send keyevent input command to the device shell. Analogous to `adb shell input keyevent keyboard 3` .

- Returns: `Promise<void>`

##### device.tap(x: number, y: number, source: InputSource = 'touchscreen')

```ts
device.tap(100, 0).then(() => null);
```

- **x** Horizontal coordinate
- **y** Vertical coordinate
- **source?:** Default `touchscreen`.

Send swipe input command to the device shell. Analogous to `adb shell input touchscreen tap x y` .

- Returns: `Promise<void>`

##### device.text(text: SimpleType, source: InputSource = 'touchscreen')

```ts
device.text('some text').then(() => null);
```

- **text** Value to be written
- **source?:** Default `touchscreen`.

Send text input command to the device shell. Analogous to `adb shell input touchscreen text 'some text'` .
Note: text input field must be focused.

- Returns: `Promise<void>`

- **device.custom<T>(CustomCommand: CommandConstruct, cb?: (err: Error, value: T) => void)**

```ts
class MyCommand extends TransportCommand {
  execute(serial: string) {
    return super.execute(serial, 'shell:ip route').then((reply) => {
      switch (reply) {
        case Reply.OKAY:
          return this.parser.readAll().then((value) => {
            const valueStr = value.toString().trim();
            return /not found/.test(valueStr) ? undefined : valueStr;
          });
        case Reply.FAIL:
          return this.parser.readError();
        default:
          return this.parser.unexpected(reply, 'OKAY or FAIL');
      }
    });
  }
}
device.custom<string>(MyCommand).then((reply: string) => {});
```

`execute()` method `TransportParseAllCommand` instance will automatically read all data from the stream and calls overridden `parse()` method.
`execute()` method `TransportParseValueCommand` instance will automatically read value from the stream and calls overridden `parse()` method.

```ts
class MyCommand extends TransportParseAllCommand {
  protected parse(value) {
    return value;
  }
  execute(serial: string, prop: string): Promise<SimpleType> {
    return super.execute(serial, `shell:getprop ${prop}`);
  }
}
```

- Returns: `Promise<T>`

##### device.openMonkey(port: number, cb?: (err: Error, value: Monkey) => void)

```ts
device.openMonkey().then((monkey: Monkey) => {
  monkey.send('');
});
```

Establishes a new monkey connection on port `1080` . For more see [`Monkey`](https://github.com/Maaaartin/adb-ts#adb-monkey).

- Returns: `Promise<Monkey>`

##### device.exec(...args: ReadonlyArray<string>)

```ts
device.exec('reboot').then((output: string) => console.log(output));
```

Executes a given command via adb console interface.

- Returns: `Promise<string>`

##### device.execShell(...args: ReadonlyArray<string>)

```ts
device.exec('pm list packages').then((output: string) => console.log(output));
```

Executes a given shell command via adb console interface. Analogous to `adb -s <serial> shell <command>` .

- Returns: `Promise<string>`

##### device.batteryStatus()

```ts
device
  .batteryStatus()
  .then((output: KeyStringObject) => console.log(KeyStringObject));
```

Retrieves current battery status. Analogous to `adb -s <serial> shell dumpsys battery` .

- Returns: `Promise<KeyStringObject>`

##### device.rm(path: string, options?: RmOption, cb?: (err: Error | null, value: string) => void)

```ts
device.rm('/sdcard/some-file').then(() => null);
```

RmOptions

- **force** Adds `-f` flag
- **interactive** Adds `-i` flag
- **recursive** Adds `-r` flag

Removes file/folder specified by `path` parameter. Analogous to `adb shell rm <filename>` .

- Returns: `Promise<string>`

##### device.mkdir(path: string, options?: MkDirOptions, cb?: (err: Error | null, value: string) => void)

```ts
device.mkdir('/sdcard/some-dir').then(() => null);
```

MkDirOptions

- **verbose** Adds `-v` flag
- **mode** Adds `-m <value>` flag, sets access mode
- **parent** Adds `-p` flag, creates parent directory if needed

Creates folder specified by `path` parameter. Analogous to `adb shell mkdir <filename>` .

- Returns: `Promise<string>`

##### device.touch(path: string, options?: TouchOptions, cb?: (err: Error | null, value: string) => void)

```ts
device.touch('/sdcard/some-file').then(() => null);
```

TouchOptions

- **aTime** Adds `-a` flag, changes access time
- **mTime** Adds `-m` flag, sets modification time
- **noCreate** Adds `-c` flag
- **symlink** Adds `-h` flag, creates symlink
- **date** Adds `-d <date>` flag
- **time** Adds `-t <time>` flag
- **reference** Adds `-r <reference>` flag

Updates access and modification times of file specified by `path` parameter. Analogous to `adb shell touch <filename>` .

- Returns: `Promise<string>`

##### device.mv(srcPath: string, destDir, options?: MvOptions, cb?: (err: Error | null, value: string) => void)

```ts
device.mv('/sdcard/file', '/sdcard/some-dir').then(() => null);
```

MvOptions

- **force** Adds `-f` flag
- **interactive** Adds `-i` flag
- **verbose** Adds `-v` flag
- **noClobber** Adds `-n` flag, no override

Moves data with `srcPath` to `destPath` parameter. Analogous to `adb shell mv <src> <dest>` .

- Returns: `Promise<string>`

##### device.cp(srcPath: string, destDir, options?: CpOptions, cb?: (err: Error | null, value: string) => void)

```ts
device.cp('/sdcard/file', '/sdcard/some-dir').then(() => null);
```

CpOptions

- **interactive** Adds `-i` flag
- **verbose** Adds `-v` flag
- **noClobber** Adds `-n` flag, no override
- **symlink** Adds `-s` flag, creates symlink
- **recursive** Adds `-r` flag, dest must be a directory
- **hardLink** Adds `-l` flag
- **noDereference** Adds `-d` flag
- **archive** Adds `-a` flag, same as `-dpr`, if specified, `noDereference`, `preserve` and `recursive` attributes are ignored

- **noFollowSymlinks** Adds `-P` flag

- **followAllSymlinks** Adds `-L` flag
- **followListedSymlinks** Adds `-H` flag
- **preserve** Adds `--preserve=[ATTRIBUTES]` flag - **mode** - **ownership** - **timestamps** - **context** - **xattr** - **all** - adds all previous arrtibutes

Copies data with `srcPath` to `destPath` parameter. Analogous to `adb shell cp <src> <dest>` .

- Returns: `Promise<string>`

##### device.fileStats(path: string, cb?: (err: Error | null, value: FileStats) => void)

```ts
device.fileStats('some-file').then((stats: FileStats) => console.log(stats));
```

Gets file stats for specified path. Use instead of `device.stat()` Analogous to `adb stats <filepath>` .

- Returns: `Promise<FileStats>`

#### adb monkey

##### device openMonkey(port: number, cb?: (err: Error, value: Monkey) => void)

Functions of adb monkey are described here.

```ts
function startMonkey() {
  device.openMonkey((err, monkey) => {
    // monkey sometimes emits an error
    monkey.on('error', () => {
      startMonkey();
    });
    // monkey might end the connection
    monkey.on('end', () => {
      startMonkey();
    });
    monkey.tap(100, 0);
  });
}
startMonkey();
```

The methods take `MonkeyCallback` as an argument. `MonkeyCallback` is a generic type of `(err: Error, value?: T, command?: string) => void` .

##### monkey.send(commands: string[] | string, cb: MonkeyCallback)

```ts
monkey.send('key event 24', (err, value, command) => {});
```

Sends a raw protocol command to monkey.

- Returns: `Monkey`

##### monkey.end()

```ts
monkey.end();
```

Ends the connection.

- Returns: `Monkey`

##### monkey.commandQueue()

```ts
monkey
  .commandQueue()
  .touchDown(100, 0)
  .sleep(5)
  .touchUp(100, 0)
  .execute((err, values) => {
    monkey.end();
  });
```

Enables to execute multiple commands at once. `execute()` method has to be called, output is available in execute callback.

- Returns: `CommandQueue`

##### monkey.keyDown((keyCode: KeyCode | number, cb?: MonkeyCallback)

```ts
monkey.keyDown(KeyCode.KEYCODE_VOLUME_DOWN, (err, value, command) => {
  startMonkey();
});
```

Sends a `key down` event. Should be used with `keyUp()` . Note that api. `press()` method performs both of these events.

- Returns: `Monkey`

##### monkey.keyUp((keyCode: KeyCode | number, cb?: MonkeyCallback)

```ts
monkey.keyUp(KeyCode.KEYCODE_VOLUME_DOWN, (err, value, command) => {});
```

Sends a `key down` event. Should be used with `keyDown()` . Note that api. `press()` method performs both of these events.

- Returns: `Monkey`

##### monkey.touchDown(x: number, y: number, cb?: MonkeyCallback)

```ts
monkey.touchDown(100, 0, (err, value, command) => {});
```

Sends a `touch down` event on the given coordinates.

- Returns: `Monkey`

##### monkey.touchUp(x: number, y: number, cb?: MonkeyCallback)

```ts
monkey.touchUp(100, 0, (err, value, command) => {});
```

Sends a `touch up` event on the given coordinates.

- Returns: `Monkey`

##### monkey.touchMove(x: number, y: number, cb?: MonkeyCallback)

```ts
monkey.touchMove(100, 0, (err, value, command) => {});
```

Sends a `touch move` event on the given coordinates.

- Returns: `Monkey`

##### monkey.flipOpen(cb?: MonkeyCallback)

```ts
monkey.flipOpen((err, value, command) => {});
```

Simulates opening the keyboard.

- Returns: `Monkey`

##### monkey.flipClose(cb?: MonkeyCallback)

```ts
monkey.flipClose((err, value, command) => {});
```

Simulates closing the keyboard.

- Returns: `Monkey`

##### monkey.wake(cb?: MonkeyCallback)

```ts
monkey.wake((err, value, command) => {});
```

Wakes the device from sleep and allows user input.

- Returns: `Monkey`

##### monkey.tap(x: number, y: number, cb?: MonkeyCallback)

```ts
monkey.tap(100, 0, (err, value, command) => {});
```

Taps the given coordinates.

- Returns: `Monkey`

##### monkey.press((keyCode: KeyCode | number, cb?: MonkeyCallback)

```ts
monkey.press(KeyCode.KEYCODE_VOLUME_DOWN, (err, value, command) => {});
```

Sends a key `press` event.

- Returns: `Monkey`

##### monkey.type((str: string, cb?: MonkeyCallback)

```ts
monkey.type('some text', (err, value, command) => {});
```

Types the given string.

- Returns: `Monkey`

##### monkey.list((cb?: MonkeyCallback<string[]>)

```ts
monkey.list((err, value, command) => {});
```

Lists supported variables. uses `listvar` command.

- Returns: `Monkey`

##### monkey.get(name: string, cb?: MonkeyCallback)

```ts
monkey.get((err, value, command) => {});
```

Gets the value of a variable. Use `list()` to retrieve a list of supported variables.

- Returns: `Monkey`

##### monkey.sleep(ms: number, cb?: MonkeyCallback)

```ts
monkey.sleep(5, (err, value, command) => {});
```

Sleeps for the given duration.

- Returns: `Monkey`

##### monkey.quit(cb?: MonkeyCallback)

```ts
monkey.quit((err, value, command) => {});
```

Closes the current monkey session and quits monkey.

- Returns: `Monkey`

##### monkey.done(cb?: MonkeyCallback)

```ts
monkey.done((err, value, command) => {});
```

Closes the current monkey session and allows a new session to connect.

- Returns: `Monkey`

##### monkey.getAmCurrentAction(cb?: MonkeyCallback)

```ts
monkey.getAmCurrentAction((err, value, command) => {});
```

Shortcut for `get('am.current.action', cb)` .

- Returns: `Monkey`

##### monkey.getAmCurrentCategories(cb?: MonkeyCallback)

```ts
monkey.getAmCurrentCategories((err, value, command) => {});
```

Shortcut for `get('am.current.categories', cb)` .

- Returns: `Monkey`

##### monkey.getAmCurrentCompClass(cb?: MonkeyCallback)

```ts
monkey.getAmCurrentCompClass((err, value, command) => {});
```

Shortcut for `get('am.current.comp.class', cb)` .

- Returns: `Monkey`

##### monkey.getAmCurrentCompPackage(cb?: MonkeyCallback)

```ts
monkey.getAmCurrentCompPackage((err, value, command) => {});
```

Shortcut for `get('am.current.comp.package', cb)` .

- Returns: `Monkey`

##### monkey.getAmCurrentData(cb?: MonkeyCallback)

```ts
monkey.getAmCurrentData((err, value, command) => {});
```

Shortcut for `get('am.current.data', cb)` .

- Returns: `Monkey`

##### monkey.getAmCurrentPackage(cb?: MonkeyCallback)

```ts
monkey.getAmCurrentPackage((err, value, command) => {});
```

Shortcut for `get('am.current.package', cb)` .

- Returns: `Monkey`

##### monkey.getBuildBoard(cb?: MonkeyCallback)

```ts
monkey.getBuildBoard((err, value, command) => {});
```

Shortcut for `get('build.board', cb)` .

- Returns: `Monkey`

##### monkey.getBuildBrand(cb?: MonkeyCallback)

```ts
monkey.getBuildBrand((err, value, command) => {});
```

Shortcut for `get('build.brand', cb)` .

- Returns: `Monkey`

##### monkey.getBuildCpuAbi(cb?: MonkeyCallback)

```ts
monkey.getBuildCpuAbi((err, value, command) => {});
```

Shortcut for `get('build.cpu_abi', cb)` .

- Returns: `Monkey`

##### monkey.getBuildDevice(cb?: MonkeyCallback)

```ts
monkey.getBuildDevice((err, value, command) => {});
```

Shortcut for `get('build.display', cb)` .

- Returns: `Monkey`

##### monkey.getBuildFingerprint(cb?: MonkeyCallback)

```ts
monkey.getBuildFingerprint((err, value, command) => {});
```

Shortcut for `get('build.fingerprint', cb)` .

- Returns: `Monkey`

##### monkey.getBuildHost(cb?: MonkeyCallback)

```ts
monkey.getBuildHost((err, value, command) => {});
```

Shortcut for `get('build.host', cb)` .

- Returns: `Monkey`

##### monkey.getBuildId(cb?: MonkeyCallback)

```ts
monkey.getBuildId((err, value, command) => {});
```

Shortcut for `get('build.id', cb)` .

- Returns: `Monkey`

##### monkey.getBuildManufacturer(cb?: MonkeyCallback)

```ts
monkey.getBuildManufacturer((err, value, command) => {});
```

Shortcut for `get('build.manufacturer', cb)` .

- Returns: `Monkey`

##### monkey.getBuildModel(cb?: MonkeyCallback)

```ts
monkey.getBuildModel((err, value, command) => {});
```

Shortcut for `get('build.model', cb)` .

- Returns: `Monkey`

##### monkey.getBuildProduct(cb?: MonkeyCallback)

```ts
monkey.getBuildProduct((err, value, command) => {});
```

Shortcut for `get('build.product', cb)` .

- Returns: `Monkey`

##### monkey.getBuildTags(cb?: MonkeyCallback)

```ts
monkey.getBuildTags((err, value, command) => {});
```

Shortcut for `get('build.tags', cb)` .

- Returns: `Monkey`

##### monkey.getBuildType(cb?: MonkeyCallback)

```ts
monkey.getBuildType((err, value, command) => {});
```

Shortcut for `get('build.type', cb)` .

- Returns: `Monkey`

##### monkey.getBuildUser(cb?: MonkeyCallback)

```ts
monkey.getBuildUser((err, value, command) => {});
```

Shortcut for `get('build.user', cb)` .

- Returns: `Monkey`

##### monkey.getBuildVersionCodename(cb?: MonkeyCallback)

```ts
monkey.getBuildVersionCodename((err, value, command) => {});
```

Shortcut for `get('build.version.codename', cb)` .

- Returns: `Monkey`

##### monkey.getBuildVersionIncremental(cb?: MonkeyCallback)

```ts
monkey.getBuildVersionIncremental((err, value, command) => {});
```

Shortcut for `get('build.version.incremental', cb)` .

- Returns: `Monkey`

##### monkey.getBuildVersionRelease(cb?: MonkeyCallback)

```ts
monkey.getBuildVersionRelease((err, value, command) => {});
```

Shortcut for `get('build.version.release', cb)` .

- Returns: `Monkey`

##### monkey.getBuildVersionSdk(cb?: MonkeyCallback)

```ts
monkey.getBuildVersionSdk((err, value, command) => {});
```

Shortcut for `get('build.version.sdk', cb)` .

- Returns: `Monkey`

##### monkey.getClockMillis(cb?: MonkeyCallback)

```ts
monkey.getClockMillis((err, value, command) => {});
```

Shortcut for `get('clock.millis', cb)` .

- Returns: `Monkey`

##### monkey.getClockRealtime(cb?: MonkeyCallback)

```ts
monkey.getClockRealtime((err, value, command) => {});
```

Shortcut for `get('clock.realtime', cb)` .

- Returns: `Monkey`

##### monkey.getClockUptime(cb?: MonkeyCallback)

```ts
monkey.getClockUptime((err, value, command) => {});
```

Shortcut for `get('clock.uptime', cb)` .

- Returns: `Monkey`

##### monkey.getDisplayDensity(cb?: MonkeyCallback)

```ts
monkey.getDisplayDensity((err, value, command) => {});
```

Shortcut for `get('display.density', cb)` .

- Returns: `Monkey`

##### monkey.getDisplayHeight(cb?: MonkeyCallback)

```ts
monkey.getDisplayHeight((err, value, command) => {});
```

Shortcut for `get('display.height', cb)` .

- Returns: `Monkey`

##### monkey.getDisplayWidth(cb?: MonkeyCallback)

```ts
monkey.getDisplayWidth((err, value, command) => {});
```

Shortcut for `get('display.width', cb)` .

- Returns: `Monkey`
