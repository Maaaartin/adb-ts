[adb-ts](../README.md) / [Exports](../modules.md) / [Client](../modules/Client.md) / Client

# Class: Client

[Client](../modules/Client.md).Client

## Table of contents

### Constructors

- [constructor](Client.Client.md#constructor)

### Properties

- [options](Client.Client.md#options)

### Methods

- [awaitActiveDevice](Client.Client.md#awaitactivedevice)
- [batteryStatus](Client.Client.md#batterystatus)
- [clear](Client.Client.md#clear)
- [connect](Client.Client.md#connect)
- [connection](Client.Client.md#connection)
- [cp](Client.Client.md#cp)
- [custom](Client.Client.md#custom)
- [customTransport](Client.Client.md#customtransport)
- [deleteApk](Client.Client.md#deleteapk)
- [disconnect](Client.Client.md#disconnect)
- [dragAndDrop](Client.Client.md#draganddrop)
- [exec](Client.Client.md#exec)
- [execDevice](Client.Client.md#execdevice)
- [execDeviceShell](Client.Client.md#execdeviceshell)
- [execInternal](Client.Client.md#execinternal)
- [fileStat](Client.Client.md#filestat)
- [forward](Client.Client.md#forward)
- [getDevicePath](Client.Client.md#getdevicepath)
- [getIpAddress](Client.Client.md#getipaddress)
- [getProp](Client.Client.md#getprop)
- [getSerialNo](Client.Client.md#getserialno)
- [getSetting](Client.Client.md#getsetting)
- [install](Client.Client.md#install)
- [installRemote](Client.Client.md#installremote)
- [ipConnect](Client.Client.md#ipconnect)
- [isInstalled](Client.Client.md#isinstalled)
- [keyEvent](Client.Client.md#keyevent)
- [kill](Client.Client.md#kill)
- [killApp](Client.Client.md#killapp)
- [listDevices](Client.Client.md#listdevices)
- [listFeatures](Client.Client.md#listfeatures)
- [listForwards](Client.Client.md#listforwards)
- [listPackages](Client.Client.md#listpackages)
- [listProperties](Client.Client.md#listproperties)
- [listReverses](Client.Client.md#listreverses)
- [listSettings](Client.Client.md#listsettings)
- [map](Client.Client.md#map)
- [mkdir](Client.Client.md#mkdir)
- [mv](Client.Client.md#mv)
- [openLogcat](Client.Client.md#openlogcat)
- [openMonkey](Client.Client.md#openmonkey)
- [openTcp](Client.Client.md#opentcp)
- [press](Client.Client.md#press)
- [pull](Client.Client.md#pull)
- [pullDataFromFile](Client.Client.md#pulldatafromfile)
- [pullFile](Client.Client.md#pullfile)
- [push](Client.Client.md#push)
- [pushDataToFile](Client.Client.md#pushdatatofile)
- [pushFile](Client.Client.md#pushfile)
- [pushInternal](Client.Client.md#pushinternal)
- [putSetting](Client.Client.md#putsetting)
- [readDir](Client.Client.md#readdir)
- [reboot](Client.Client.md#reboot)
- [remount](Client.Client.md#remount)
- [reverse](Client.Client.md#reverse)
- [rm](Client.Client.md#rm)
- [roll](Client.Client.md#roll)
- [root](Client.Client.md#root)
- [screenshot](Client.Client.md#screenshot)
- [setProp](Client.Client.md#setprop)
- [shell](Client.Client.md#shell)
- [shutdown](Client.Client.md#shutdown)
- [startActivity](Client.Client.md#startactivity)
- [startServer](Client.Client.md#startserver)
- [startService](Client.Client.md#startservice)
- [swipe](Client.Client.md#swipe)
- [syncService](Client.Client.md#syncservice)
- [tap](Client.Client.md#tap)
- [tcpip](Client.Client.md#tcpip)
- [text](Client.Client.md#text)
- [touch](Client.Client.md#touch)
- [trackDevices](Client.Client.md#trackdevices)
- [transport](Client.Client.md#transport)
- [uninstall](Client.Client.md#uninstall)
- [usb](Client.Client.md#usb)
- [version](Client.Client.md#version)
- [waitBootComplete](Client.Client.md#waitbootcomplete)
- [waitFor](Client.Client.md#waitfor)

## Constructors

### constructor

• **new Client**(`options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`AdbClientOptions`](../modules/Util.md#adbclientoptions) | see AdbClientOptions for more details |

#### Defined in

[src/client.ts:130](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L130)

## Properties

### options

• `Private` **options**: [`AdbClientOptionsValues`](../modules/Util.md#adbclientoptionsvalues)

#### Defined in

[src/client.ts:125](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L125)

## Methods

### awaitActiveDevice

▸ `Private` **awaitActiveDevice**(`serial`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1340](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1340)

___

### batteryStatus

▸ **batteryStatus**(`serial`): `Promise`<[`PropertyMap`](../modules/Util.md#propertymap)\>

Retrieves current battery status.
Analogous to `adb -s <serial> shell dumpsys battery` .

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<[`PropertyMap`](../modules/Util.md#propertymap)\>

#### Defined in

[src/client.ts:1956](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1956)

▸ **batteryStatus**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`PropertyMap`](../modules/Util.md#propertymap)\> |

#### Returns

`void`

#### Defined in

[src/client.ts:1957](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1957)

___

### clear

▸ **clear**(`serial`, `pkg`): `Promise`<`void`\>

Deletes all data associated with a package from the device.
Analogous to `adb shell pm clear <pkg>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1005](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1005)

▸ **clear**(`serial`, `pkg`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1006](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1006)

___

### connect

▸ **connect**(`host`): `Promise`<`string`\>

Connects to device over local network.

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `string` |

#### Returns

`Promise`<`string`\>

**`Example`**

```ts
adb.map(async (device) => {
   await device.tcpip();
   const [ip] = await device.getIpAddress();
   await adb.connect(ip);
});
```

#### Defined in

[src/client.ts:238](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L238)

▸ **connect**(`host`, `port`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `string` |
| `port` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/client.ts:239](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L239)

▸ **connect**(`host`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<`string`\> |

#### Returns

`void`

#### Defined in

[src/client.ts:240](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L240)

▸ **connect**(`host`, `port`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `string` |
| `port` | `number` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<`string`\> |

#### Returns

`void`

#### Defined in

[src/client.ts:241](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L241)

___

### connection

▸ `Private` **connection**(): `Promise`<[`Connection`](Connection.Connection.md)\>

#### Returns

`Promise`<[`Connection`](Connection.Connection.md)\>

#### Defined in

[src/client.ts:155](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L155)

___

### cp

▸ **cp**(`serial`, `srcPath`, `destPath`): `Promise`<`void`\>

Copies data with `srcPath` to `destPath` parameter.
Analogous to `adb shell cp <src> <dest>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` |
| `destPath` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:2093](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L2093)

▸ **cp**(`serial`, `srcPath`, `destPath`, `options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` |
| `destPath` | `string` |
| `options` | [`CpOptions`](../interfaces/Util.CpOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:2094](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L2094)

▸ **cp**(`serial`, `srcPath`, `destPath`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` |
| `destPath` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:2100](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L2100)

▸ **cp**(`serial`, `srcPath`, `destPath`, `options`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` |
| `destPath` | `string` |
| `options` | [`CpOptions`](../interfaces/Util.CpOptions.md) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:2101](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L2101)

___

### custom

▸ **custom**<`T`, `P`\>(`CustomCommand`, `...args`): `Promise`<`T`\>

Enables to execute any custom command.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `P` | extends `unknown`[] = `unknown`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `CustomCommand` | [`CommandConstruct`](../interfaces/Util.CommandConstruct.md)<`T`, `P`\> |
| `...args` | `P` |

#### Returns

`Promise`<`T`\>

**`Example`**

```ts
class MyCommand extends Command<number> {
  protected autoEnd = true;
  private arg: string;
  constructor(connection: Connection, arg: string) {
      super(connection);
      this.arg = arg;
  }
  async execute(): Promise<number> {
      const reply = await this.initExecute(this.arg);
      switch (reply) {
          case Reply.OKAY:
              const value = await this.parser.readValue();
              return parseInt(value.toString(), 10);
          case Reply.FAIL:
              throw await this.parser.readError();
          default:
              return parseInt(reply, 10);
         }
     }
 }
```

#### Defined in

[src/client.ts:1778](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1778)

___

### customTransport

▸ **customTransport**<`T`, `P`\>(`CustomCommand`, `serial`, `...args`): `Promise`<`T`\>

Enables to execute any custom transport command.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `T` |
| `P` | extends `unknown`[] = `unknown`[] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `CustomCommand` | [`TransportCommandConstruct`](../interfaces/Util.TransportCommandConstruct.md)<`T`, `P`\> |
| `serial` | `string` |
| `...args` | `P` |

#### Returns

`Promise`<`T`\>

**`Example`**

```ts
class MyCommand extends TransportCommand<null> {
   protected keepAlive = false;
   private arg: string;
   constructor(connection: Connection, serial: string, arg: string) {
       super(connection, serial);
       this.arg = arg;
   }
   protected get Cmd() {
       return 'test '.concat(this.arg);
   }
   protected postExecute(): null {
       return null;
   }
}
```

#### Defined in

[src/client.ts:1804](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1804)

___

### deleteApk

▸ `Private` **deleteApk**(`serial`, `pathToApk`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pathToApk` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:496](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L496)

___

### disconnect

▸ **disconnect**(`host`): `Promise`<`string`\>

Disconnects from the given device.

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/client.ts:253](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L253)

▸ **disconnect**(`host`, `port`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `string` |
| `port` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/client.ts:254](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L254)

▸ **disconnect**(`host`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<`string`\> |

#### Returns

`void`

#### Defined in

[src/client.ts:255](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L255)

▸ **disconnect**(`host`, `port`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `host` | `string` |
| `port` | `number` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<`string`\> |

#### Returns

`void`

#### Defined in

[src/client.ts:256](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L256)

___

### dragAndDrop

▸ **dragAndDrop**(`serial`, `x1`, `y1`, `x2`, `y2`): `Promise`<`void`\>

Sends draganddrop input command to the device shell.
Analogous to `adb shell input touchscreen draganddrop x1 y1 x2 y2`.
Default input source is `touchscreen`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serial` | `string` | - |
| `x1` | `number` | Horizontal starting coordinate. |
| `y1` | `number` | Vertical starting coordinate. |
| `x2` | `number` | Horizontal ending coordinate. |
| `y2` | `number` | Vertical ending coordinate. |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:691](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L691)

▸ **dragAndDrop**(`serial`, `x1`, `y1`, `x2`, `y2`, `options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `x1` | `number` |
| `y1` | `number` |
| `x2` | `number` |
| `y2` | `number` |
| `options` | [`InputDurationOptions`](../interfaces/Util.InputDurationOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:698](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L698)

▸ **dragAndDrop**(`serial`, `x1`, `y1`, `x2`, `y2`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `x1` | `number` |
| `y1` | `number` |
| `x2` | `number` |
| `y2` | `number` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:706](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L706)

▸ **dragAndDrop**(`serial`, `x1`, `y1`, `x2`, `y2`, `options`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `x1` | `number` |
| `y1` | `number` |
| `x2` | `number` |
| `y2` | `number` |
| `options` | [`InputDurationOptions`](../interfaces/Util.InputDurationOptions.md) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:714](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L714)

___

### exec

▸ **exec**(`cmd`): `Promise`<`string`\>

Executes a given command via adb console interface.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cmd` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/client.ts:1914](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1914)

▸ **exec**(`cmd`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cmd` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<`string`\> |

#### Returns

`void`

#### Defined in

[src/client.ts:1915](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1915)

___

### execDevice

▸ **execDevice**(`serial`, `cmd`): `Promise`<`string`\>

Executes a given command on specific device via adb console interface.
 Analogous to `adb -s <serial> <command>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cmd` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/client.ts:1924](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1924)

▸ **execDevice**(`serial`, `cmd`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cmd` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<`string`\> |

#### Returns

`void`

#### Defined in

[src/client.ts:1925](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1925)

___

### execDeviceShell

▸ **execDeviceShell**(`serial`, `cmd`): `Promise`<`string`\>

Executes a given command on specific device shell via adb console interface.
Analogous to `adb -s <serial> shell <command>` .

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cmd` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/client.ts:1938](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1938)

▸ **execDeviceShell**(`serial`, `cmd`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cmd` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<`string`\> |

#### Returns

`void`

#### Defined in

[src/client.ts:1939](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1939)

___

### execInternal

▸ `Private` **execInternal**(`...args`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | readonly `string`[] |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/client.ts:1890](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1890)

___

### fileStat

▸ **fileStat**(`serial`, `path`): `Promise`<[`FileStat`](FileStat.FileStat.md)\>

Gets file stats for specified path.
Analogous to `adb stat <filepath>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |

#### Returns

`Promise`<[`FileStat`](FileStat.FileStat.md)\>

#### Defined in

[src/client.ts:2133](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L2133)

▸ **fileStat**(`serial`, `path`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`FileStat`](FileStat.FileStat.md)\> |

#### Returns

`void`

#### Defined in

[src/client.ts:2134](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L2134)

___

### forward

▸ **forward**(`serial`, `local`, `remote`): `Promise`<`void`\>

Forwards socket connections from the ADB server host (local) to the device (remote).
Analogous to `adb forward <local> <remote>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `local` | `string` |
| `remote` | `string` |

#### Returns

`Promise`<`void`\>

**`Example`**

```ts
adb.forward('serial', 'tcp:9222', 'localabstract:chrome_devtools_remote')
```

#### Defined in

[src/client.ts:422](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L422)

▸ **forward**(`serial`, `local`, `remote`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `local` | `string` |
| `remote` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:423](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L423)

___

### getDevicePath

▸ **getDevicePath**(`serial`): `Promise`<`string`\>

Gets the device path of the device identified by the device.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/client.ts:331](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L331)

▸ **getDevicePath**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<`string`\> |

#### Returns

`void`

#### Defined in

[src/client.ts:332](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L332)

___

### getIpAddress

▸ **getIpAddress**(`serial`): `Promise`<`string`[]\>

Gets the ipv4 addresses of default wlan interface.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[src/client.ts:402](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L402)

▸ **getIpAddress**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<`string`[]\> |

#### Returns

`void`

#### Defined in

[src/client.ts:403](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L403)

___

### getProp

▸ **getProp**(`serial`, `prop`): `Promise`<[`PropertyValue`](../modules/Util.md#propertyvalue)\>

Gets property from the device.
Analogues to `adb shell getprop <prop>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `prop` | `string` |

#### Returns

`Promise`<[`PropertyValue`](../modules/Util.md#propertyvalue)\>

#### Defined in

[src/client.ts:1627](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1627)

▸ **getProp**(`serial`, `prop`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `prop` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`PropertyValue`](../modules/Util.md#propertyvalue)\> |

#### Returns

`void`

#### Defined in

[src/client.ts:1628](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1628)

___

### getSerialNo

▸ **getSerialNo**(`serial`): `Promise`<`string`\>

Gets the serial number of the device.
Meant for getting serial number of local devices.
Analogous to `adb shell getprop ro.serialno`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/client.ts:317](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L317)

▸ **getSerialNo**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<`string`\> |

#### Returns

`void`

#### Defined in

[src/client.ts:318](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L318)

___

### getSetting

▸ **getSetting**(`serial`, `mode`, `name`): `Promise`<[`PropertyValue`](../modules/Util.md#propertyvalue)\>

Gets setting from the device.
Analogues to `adb shell settings get <mode> <name>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `mode` | [`SettingsMode`](../modules/Util.md#settingsmode) |
| `name` | `string` |

#### Returns

`Promise`<[`PropertyValue`](../modules/Util.md#propertyvalue)\>

#### Defined in

[src/client.ts:1711](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1711)

▸ **getSetting**(`serial`, `mode`, `name`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `mode` | [`SettingsMode`](../modules/Util.md#settingsmode) |
| `name` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`PropertyValue`](../modules/Util.md#propertyvalue)\> |

#### Returns

`void`

#### Defined in

[src/client.ts:1716](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1716)

___

### install

▸ **install**(`serial`, `apk`): `Promise`<`void`\>

Installs an apk to the device.
Analogous to `adb install <pkg>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `apk` | `string` \| `Readable` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1033](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1033)

▸ **install**(`serial`, `apk`, `options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `apk` | `string` \| `Readable` |
| `options` | [`InstallOptions`](../modules/Util.md#installoptions) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1034](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1034)

▸ **install**(`serial`, `apk`, `options`, `args`): `Promise`<`void`\>

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serial` | `string` | - |
| `apk` | `string` \| `Readable` | - |
| `options` | [`InstallOptions`](../modules/Util.md#installoptions) | - |
| `args` | `string` | Extra arguments. E.g. `--fastdeploy` flag. |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1042](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1042)

▸ **install**(`serial`, `apk`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `apk` | `string` \| `Readable` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1048](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1048)

▸ **install**(`serial`, `apk`, `options`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `apk` | `string` \| `Readable` |
| `options` | [`InstallOptions`](../modules/Util.md#installoptions) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1049](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1049)

▸ **install**(`serial`, `apk`, `options`, `args`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `apk` | `string` \| `Readable` |
| `options` | [`InstallOptions`](../modules/Util.md#installoptions) |
| `args` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1055](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1055)

___

### installRemote

▸ `Private` **installRemote**(`serial`, `apk`, `options?`, `args?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `apk` | `string` |
| `options?` | [`InstallOptions`](../modules/Util.md#installoptions) |
| `args?` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1016](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1016)

___

### ipConnect

▸ `Private` **ipConnect**(`Construct`, `host`, `port`, `cb`): `void` \| `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `Construct` | [`IpConnectConstruct`](../interfaces/Util.IpConnectConstruct.md) |
| `host` | `string` |
| `port` | `undefined` \| `number` \| [`ValueCallback`](../modules/Util.md#valuecallback)<`string`\> |
| `cb` | `undefined` \| [`ValueCallback`](../modules/Util.md#valuecallback)<`string`\> |

#### Returns

`void` \| `Promise`<`string`\>

#### Defined in

[src/client.ts:205](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L205)

___

### isInstalled

▸ **isInstalled**(`serial`, `pkg`): `Promise`<`boolean`\>

Tells if a package is installed or not.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/client.ts:1133](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1133)

▸ **isInstalled**(`serial`, `pkg`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<`boolean`\> |

#### Returns

`void`

#### Defined in

[src/client.ts:1134](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1134)

___

### keyEvent

▸ **keyEvent**(`serial`, `code`): `Promise`<`void`\>

Sends keyevent input command to the device shell.
Analogous to `adb shell input keyboard keyevent <code>`.
Default input source is `keyboard`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serial` | `string` | - |
| `code` | [`KeyCode`](../enums/Util.KeyCode.md) \| [`NonEmptyArray`](../modules/Util.md#nonemptyarray)<[`KeyCode`](../enums/Util.KeyCode.md)\> | Key code to send. |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:819](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L819)

▸ **keyEvent**(`serial`, `code`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `code` | `number` \| [`NonEmptyArray`](../modules/Util.md#nonemptyarray)<`number`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:823](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L823)

▸ **keyEvent**(`serial`, `code`, `options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `code` | [`KeyCode`](../enums/Util.KeyCode.md) \| [`NonEmptyArray`](../modules/Util.md#nonemptyarray)<[`KeyCode`](../enums/Util.KeyCode.md)\> |
| `options` | [`KeyEventOptions`](../interfaces/Util.KeyEventOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:828](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L828)

▸ **keyEvent**(`serial`, `code`, `options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `code` | `number` \| [`NonEmptyArray`](../modules/Util.md#nonemptyarray)<`number`\> |
| `options` | [`KeyEventOptions`](../interfaces/Util.KeyEventOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:833](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L833)

▸ **keyEvent**(`serial`, `code`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `code` | [`KeyCode`](../enums/Util.KeyCode.md) \| [`NonEmptyArray`](../modules/Util.md#nonemptyarray)<[`KeyCode`](../enums/Util.KeyCode.md)\> |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:839](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L839)

▸ **keyEvent**(`serial`, `code`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `code` | `number` \| [`NonEmptyArray`](../modules/Util.md#nonemptyarray)<`number`\> |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:844](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L844)

▸ **keyEvent**(`serial`, `code`, `options`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `code` | [`KeyCode`](../enums/Util.KeyCode.md) \| [`NonEmptyArray`](../modules/Util.md#nonemptyarray)<[`KeyCode`](../enums/Util.KeyCode.md)\> |
| `options` | [`KeyEventOptions`](../interfaces/Util.KeyEventOptions.md) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:850](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L850)

▸ **keyEvent**(`serial`, `code`, `options`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `code` | `number` \| [`NonEmptyArray`](../modules/Util.md#nonemptyarray)<`number`\> |
| `options` | [`KeyEventOptions`](../interfaces/Util.KeyEventOptions.md) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:856](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L856)

___

### kill

▸ **kill**(): `Promise`<`void`\>

Kills the adb server.

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:297](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L297)

▸ **kill**(`cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:298](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L298)

___

### killApp

▸ **killApp**(`serial`, `pkg`): `Promise`<`void`\>

Force stops given package.
Analogous to `adb shell am force-stop <package>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1879](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1879)

▸ **killApp**(`serial`, `pkg`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1880](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1880)

___

### listDevices

▸ **listDevices**(): `Promise`<[`IDevice`](../interfaces/Util.IDevice.md)[]\>

Gets the list of currently connected devices and emulators.

#### Returns

`Promise`<[`IDevice`](../interfaces/Util.IDevice.md)[]\>

#### Defined in

[src/client.ts:268](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L268)

▸ **listDevices**(`cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`IDevice`](../interfaces/Util.IDevice.md)[]\> |

#### Returns

`void`

#### Defined in

[src/client.ts:269](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L269)

___

### listFeatures

▸ **listFeatures**(`serial`): `Promise`<[`PropertyMap`](../modules/Util.md#propertymap)\>

Lists features of the device.
Analogous to `adb shell pm list features`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<[`PropertyMap`](../modules/Util.md#propertymap)\>

#### Defined in

[src/client.ts:367](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L367)

▸ **listFeatures**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`PropertyMap`](../modules/Util.md#propertymap)\> |

#### Returns

`void`

#### Defined in

[src/client.ts:368](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L368)

___

### listForwards

▸ **listForwards**(`serial`): `Promise`<[`ForwardsObject`](../interfaces/Util.ForwardsObject.md)[]\>

Lists all forwarded connections.
Analogous to `adb forward --list`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<[`ForwardsObject`](../interfaces/Util.ForwardsObject.md)[]\>

#### Defined in

[src/client.ts:442](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L442)

▸ **listForwards**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`ForwardsObject`](../interfaces/Util.ForwardsObject.md)[]\> |

#### Returns

`void`

#### Defined in

[src/client.ts:443](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L443)

___

### listPackages

▸ **listPackages**(`serial`): `Promise`<`string`[]\>

Lists installed packages.
Analogous to `adb shell pm list packages`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<`string`[]\>

#### Defined in

[src/client.ts:385](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L385)

▸ **listPackages**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<`string`[]\> |

#### Returns

`void`

#### Defined in

[src/client.ts:386](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L386)

___

### listProperties

▸ **listProperties**(`serial`): `Promise`<[`PropertyMap`](../modules/Util.md#propertymap)\>

Lists properties of the device.
Analogous to `adb shell getprop`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<[`PropertyMap`](../modules/Util.md#propertymap)\>

#### Defined in

[src/client.ts:349](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L349)

▸ **listProperties**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`PropertyMap`](../modules/Util.md#propertymap)\> |

#### Returns

`void`

#### Defined in

[src/client.ts:350](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L350)

___

### listReverses

▸ **listReverses**(`serial`): `Promise`<[`ReversesObject`](../interfaces/Util.ReversesObject.md)[]\>

Lists all reversed connections.
Analogous to `adb reverse --list`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<[`ReversesObject`](../interfaces/Util.ReversesObject.md)[]\>

#### Defined in

[src/client.ts:482](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L482)

▸ **listReverses**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`ReversesObject`](../interfaces/Util.ReversesObject.md)[]\> |

#### Returns

`void`

#### Defined in

[src/client.ts:483](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L483)

___

### listSettings

▸ **listSettings**(`serial`, `mode`): `Promise`<[`PropertyMap`](../modules/Util.md#propertymap)\>

Lists settings of the device.
Analogues to `adb shell settings list <mode>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `mode` | [`SettingsMode`](../modules/Util.md#settingsmode) |

#### Returns

`Promise`<[`PropertyMap`](../modules/Util.md#propertymap)\>

#### Defined in

[src/client.ts:1688](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1688)

▸ **listSettings**(`serial`, `mode`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `mode` | [`SettingsMode`](../modules/Util.md#settingsmode) |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`PropertyMap`](../modules/Util.md#propertymap)\> |

#### Returns

`void`

#### Defined in

[src/client.ts:1689](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1689)

___

### map

▸ **map**<`T`\>(`mapper`): `Promise`<`T`[]\>

Maps through all connected devices.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `mapper` | (`device`: [`Device`](Device.Device.md)) => `T` \| `Promise`<`T`\> |

#### Returns

`Promise`<`T`[]\>

#### Defined in

[src/client.ts:1453](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1453)

___

### mkdir

▸ **mkdir**(`serial`, `path`): `Promise`<`void`\>

Creates directory specified by `path` parameter.
Analogous to `adb shell mkdir <path>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1997](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1997)

▸ **mkdir**(`serial`, `path`, `options?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |
| `options?` | [`MkDirOptions`](../interfaces/Util.MkDirOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1998](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1998)

▸ **mkdir**(`serial`, `path`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1999](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1999)

▸ **mkdir**(`serial`, `path`, `options`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |
| `options` | [`MkDirOptions`](../interfaces/Util.MkDirOptions.md) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:2000](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L2000)

___

### mv

▸ **mv**(`serial`, `srcPath`, `destPath`): `Promise`<`void`\>

Moves data with `srcPath` to `destPath` parameter.
Analogous to `adb shell mv <src> <dest>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` |
| `destPath` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:2053](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L2053)

▸ **mv**(`serial`, `srcPath`, `destPath`, `options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` |
| `destPath` | `string` |
| `options` | [`MvOptions`](../interfaces/Util.MvOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:2054](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L2054)

▸ **mv**(`serial`, `srcPath`, `destPath`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` |
| `destPath` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:2060](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L2060)

▸ **mv**(`serial`, `srcPath`, `destPath`, `options`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` |
| `destPath` | `string` |
| `options` | [`MvOptions`](../interfaces/Util.MvOptions.md) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:2061](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L2061)

___

### openLogcat

▸ **openLogcat**(`serial`): `Promise`<[`LogcatReader`](Logcat.LogcatReader.md)\>

Opens logcat.
Analogous to `adb logcat`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<[`LogcatReader`](Logcat.LogcatReader.md)\>

**`See`**

`LogcatReader` and `LogcatOptions` for more details.

**`Example`**

```ts
import { Client, Priority } from 'adb-ts';
const adb = new Client();
const logcat = await adb.openLogcat('serial', {
    filter: (entry) => entry.priority > Priority.INFO
});
logcat.on('entry', (entry) => {
    console.log(entry);
});
```

#### Defined in

[src/client.ts:965](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L965)

▸ **openLogcat**(`serial`, `options`): `Promise`<[`LogcatReader`](Logcat.LogcatReader.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `options` | [`LogcatOptions`](../modules/Util.md#logcatoptions) |

#### Returns

`Promise`<[`LogcatReader`](Logcat.LogcatReader.md)\>

#### Defined in

[src/client.ts:966](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L966)

▸ **openLogcat**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`LogcatReader`](Logcat.LogcatReader.md)\> |

#### Returns

`void`

#### Defined in

[src/client.ts:967](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L967)

▸ **openLogcat**(`serial`, `options`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `options` | [`LogcatOptions`](../modules/Util.md#logcatoptions) |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`LogcatReader`](Logcat.LogcatReader.md)\> |

#### Returns

`void`

#### Defined in

[src/client.ts:968](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L968)

___

### openMonkey

▸ **openMonkey**(`serial`): `Promise`<[`Monkey`](Monkey.Monkey.md)\>

Establishes a new monkey connection on port `1080`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<[`Monkey`](Monkey.Monkey.md)\>

#### Defined in

[src/client.ts:1817](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1817)

▸ **openMonkey**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`Monkey`](Monkey.Monkey.md)\> |

#### Returns

`void`

#### Defined in

[src/client.ts:1818](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1818)

___

### openTcp

▸ **openTcp**(`serial`, `port`): `Promise`<[`Connection`](Connection.Connection.md)\>

Opens a direct TCP connection to specified port on the device.
Analogous to `adb tcp <port>:<host>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `port` | `number` |

#### Returns

`Promise`<[`Connection`](Connection.Connection.md)\>

**`Example`**

```ts
const socket = await adb.openTcp('serial', 5555);
// socket.write(...)
```

#### Defined in

[src/client.ts:588](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L588)

▸ **openTcp**(`serial`, `port`, `host`): `Promise`<[`Connection`](Connection.Connection.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `port` | `number` |
| `host` | `string` |

#### Returns

`Promise`<[`Connection`](Connection.Connection.md)\>

#### Defined in

[src/client.ts:589](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L589)

▸ **openTcp**(`serial`, `port`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `port` | `number` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`Connection`](Connection.Connection.md)\> |

#### Returns

`void`

#### Defined in

[src/client.ts:590](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L590)

▸ **openTcp**(`serial`, `port`, `host`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `port` | `number` |
| `host` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`Connection`](Connection.Connection.md)\> |

#### Returns

`void`

#### Defined in

[src/client.ts:591](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L591)

___

### press

▸ **press**(`serial`): `Promise`<`void`\>

Sends roll input command to the device shell.
Analogous to `adb shell input trackball press`.
Default input source is `trackball`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:664](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L664)

▸ **press**(`serial`, `source`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `source` | [`InputSource`](../modules/Util.md#inputsource) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:665](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L665)

▸ **press**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:666](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L666)

▸ **press**(`serial`, `source`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `source` | [`InputSource`](../modules/Util.md#inputsource) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:667](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L667)

___

### pull

▸ **pull**(`serial`, `path`): `Promise`<[`PullTransfer`](Sync.PullTransfer.md)\>

Gets a PullTransfer instance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |

#### Returns

`Promise`<[`PullTransfer`](Sync.PullTransfer.md)\>

**`See`**

`PullTransfer`

**`Example`**

```ts
let data = '';
const transfer = await adb.pull('serial', '/path')
transfer.on('data', (chunk) => {
    data += chunk.toString();
});
transfer.on('end', () => {
    console.log(data);
});
```

#### Defined in

[src/client.ts:1272](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1272)

▸ **pull**(`serial`, `path`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`PullTransfer`](Sync.PullTransfer.md)\> |

#### Returns

`void`

#### Defined in

[src/client.ts:1273](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1273)

___

### pullDataFromFile

▸ **pullDataFromFile**(`serial`, `srcPath`): `Promise`<`Buffer`\>

Wraps [pull](Client.Client.md#pull) method, reads the file content and resolves with the output.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` |

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[src/client.ts:1526](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1526)

▸ **pullDataFromFile**(`serial`, `srcPath`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<`Buffer`\> |

#### Returns

`void`

#### Defined in

[src/client.ts:1527](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1527)

___

### pullFile

▸ **pullFile**(`serial`, `srcPath`, `destPath`): `Promise`<`void`\>

Wraps [pull](Client.Client.md#pull) method, reads the content of file on the device and write it to a file on the machine.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` |
| `destPath` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1561](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1561)

▸ **pullFile**(`serial`, `srcPath`, `destPath`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` |
| `destPath` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1562](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1562)

___

### push

▸ **push**(`serial`, `srcPath`, `destPath`): `Promise`<[`PushTransfer`](Sync.PushTransfer.md)\>

Gets a PushTransfer instance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` \| `Readable` |
| `destPath` | `string` |

#### Returns

`Promise`<[`PushTransfer`](Sync.PushTransfer.md)\>

**`See`**

`PushTransfer`

**`Example`**

```ts
const transfer = await adb.push('serial', '/path-src', '/path-dest')
transfer.on('end', () => { });
```

#### Defined in

[src/client.ts:1297](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1297)

▸ **push**(`serial`, `srcPath`, `destPath`, `mode`): `Promise`<[`PushTransfer`](Sync.PushTransfer.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` \| `Readable` |
| `destPath` | `string` |
| `mode` | [`SyncMode`](../enums/Sync.SyncMode.md) |

#### Returns

`Promise`<[`PushTransfer`](Sync.PushTransfer.md)\>

#### Defined in

[src/client.ts:1302](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1302)

▸ **push**(`serial`, `srcPath`, `destPath`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` \| `Readable` |
| `destPath` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`PushTransfer`](Sync.PushTransfer.md)\> |

#### Returns

`void`

#### Defined in

[src/client.ts:1308](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1308)

▸ **push**(`serial`, `srcPath`, `destPath`, `mode`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` \| `Readable` |
| `destPath` | `string` |
| `mode` | [`SyncMode`](../enums/Sync.SyncMode.md) |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`PushTransfer`](Sync.PushTransfer.md)\> |

#### Returns

`void`

#### Defined in

[src/client.ts:1314](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1314)

___

### pushDataToFile

▸ **pushDataToFile**(`serial`, `data`, `destPath`): `Promise`<`void`\>

Wraps [push](Client.Client.md#push) method, provides API for quick data writing.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `data` | `string` \| `Buffer` \| `Readable` |
| `destPath` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1475](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1475)

▸ **pushDataToFile**(`serial`, `data`, `destPath`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `data` | `string` \| `Buffer` \| `Readable` |
| `destPath` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1480](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1480)

___

### pushFile

▸ **pushFile**(`serial`, `srcPath`, `destPath`): `Promise`<`void`\>

Wraps [push](Client.Client.md#push) method, reads the content of file on the host to a file on the device.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` |
| `destPath` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1507](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1507)

▸ **pushFile**(`serial`, `srcPath`, `destPath`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `srcPath` | `string` |
| `destPath` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1508](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1508)

___

### pushInternal

▸ `Private` **pushInternal**(`serial`, `data`, `dest`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `data` | `string` \| `Readable` |
| `dest` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1460](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1460)

___

### putSetting

▸ **putSetting**(`serial`, `mode`, `name`, `value`): `Promise`<`void`\>

Puts setting on the device.
Analogues to `adb shell settings put <mode> <name> <value>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `mode` | [`SettingsMode`](../modules/Util.md#settingsmode) |
| `name` | `string` |
| `value` | [`PrimitiveType`](../modules/Util.md#primitivetype) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1650](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1650)

▸ **putSetting**(`serial`, `mode`, `name`, `value`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `mode` | [`SettingsMode`](../modules/Util.md#settingsmode) |
| `name` | `string` |
| `value` | [`PrimitiveType`](../modules/Util.md#primitivetype) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1656](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1656)

___

### readDir

▸ **readDir**(`serial`, `path`): `Promise`<[`SyncEntry`](Sync.SyncEntry.md)[]\>

Reads given directory.
The path should start with `/`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |

#### Returns

`Promise`<[`SyncEntry`](Sync.SyncEntry.md)[]\>

#### Defined in

[src/client.ts:1242](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1242)

▸ **readDir**(`serial`, `path`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`SyncEntry`](Sync.SyncEntry.md)[]\> |

#### Returns

`void`

#### Defined in

[src/client.ts:1243](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1243)

___

### reboot

▸ **reboot**(`serial`): `Promise`<`void`\>

Reboots the device.
Analogous to `adb reboot`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:506](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L506)

▸ **reboot**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:507](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L507)

___

### remount

▸ **remount**(`serial`): `Promise`<`void`\>

Attempts to remount the `/system` partition in read-write mode.
Can be done on a rooted device. Analogous to `adb remount`.
Analogous to `adb remount`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:537](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L537)

▸ **remount**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:538](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L538)

___

### reverse

▸ **reverse**(`serial`, `local`, `remote`): `Promise`<`void`\>

Reverses socket connections from the device (remote) to the ADB server host (local).
Analogous to `adb reverse <remote> <local>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `local` | `string` |
| `remote` | `string` |

#### Returns

`Promise`<`void`\>

**`Example`**

```ts
adb.reverse('serial', 'localabstract:chrome_devtools_remote', 'tcp:9222')
```

#### Defined in

[src/client.ts:462](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L462)

▸ **reverse**(`serial`, `local`, `remote`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `local` | `string` |
| `remote` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:463](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L463)

___

### rm

▸ **rm**(`serial`, `path`): `Promise`<`void`\>

Removes file/folder specified by `path` parameter.
Analogous to `adb shell rm <path>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1974](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1974)

▸ **rm**(`serial`, `path`, `options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |
| `options` | [`RmOptions`](../interfaces/Util.RmOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1975](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1975)

▸ **rm**(`serial`, `path`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1976](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1976)

▸ **rm**(`serial`, `path`, `options`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |
| `options` | [`RmOptions`](../interfaces/Util.RmOptions.md) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1977](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1977)

___

### roll

▸ **roll**(`serial`, `x`, `y`): `Promise`<`void`\>

Sends roll input command to the device shell.
Analogous to `adb shell input trackball roll <x> <y>`.
Default input source is `trackball`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serial` | `string` | - |
| `x` | `number` | Horizontal coordinate. |
| `y` | `number` | Vertical coordinate. |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:623](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L623)

▸ **roll**(`serial`, `x`, `y`, `source`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `x` | `number` |
| `y` | `number` |
| `source` | [`InputSource`](../modules/Util.md#inputsource) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:624](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L624)

▸ **roll**(`serial`, `x`, `y`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `x` | `number` |
| `y` | `number` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:630](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L630)

▸ **roll**(`serial`, `x`, `y`, `source`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `x` | `number` |
| `y` | `number` |
| `source` | [`InputSource`](../modules/Util.md#inputsource) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:631](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L631)

___

### root

▸ **root**(`serial`): `Promise`<`void`\>

Attempts to which the device to the root mode.
Analogous to `adb root`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:552](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L552)

▸ **root**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:553](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L553)

___

### screenshot

▸ **screenshot**(`serial`): `Promise`<`Buffer`\>

Takes a screenshot on the specified device.
Analogous to `adb shell screencap -p`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[src/client.ts:567](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L567)

▸ **screenshot**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<`Buffer`\> |

#### Returns

`void`

#### Defined in

[src/client.ts:568](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L568)

___

### setProp

▸ **setProp**(`serial`, `prop`, `value`): `Promise`<`void`\>

Sets property on the device.
Analogues to `adb shell setprop <prop> <value>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `prop` | `string` |
| `value` | [`PrimitiveType`](../modules/Util.md#primitivetype) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1602](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1602)

▸ **setProp**(`serial`, `prop`, `value`, `cb?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `prop` | `string` |
| `value` | [`PrimitiveType`](../modules/Util.md#primitivetype) |
| `cb?` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1603](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1603)

___

### shell

▸ **shell**(`serial`, `command`): `Promise`<`string`\>

Executes a given shell command via adb console interface. Analogous to `adb -s <serial> shell <command>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `command` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/client.ts:1739](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1739)

▸ **shell**(`serial`, `command`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `command` | `string` |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<`string`\> |

#### Returns

`void`

#### Defined in

[src/client.ts:1740](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1740)

___

### shutdown

▸ **shutdown**(`serial`): `Promise`<`void`\>

Shuts the device down.
Analogous to `adb reboot -p`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:521](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L521)

▸ **shutdown**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:522](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L522)

___

### startActivity

▸ **startActivity**(`serial`, `pkg`, `activity`): `Promise`<`void`\>

Starts a new activity with options.
Analogous to `adb shell am start <pkg./activity>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |
| `activity` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1152](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1152)

▸ **startActivity**(`serial`, `pkg`, `activity`, `options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |
| `activity` | `string` |
| `options` | [`StartActivityOptions`](../interfaces/Util.StartActivityOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1153](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1153)

▸ **startActivity**(`serial`, `pkg`, `activity`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |
| `activity` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1159](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1159)

▸ **startActivity**(`serial`, `pkg`, `activity`, `options`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |
| `activity` | `string` |
| `options` | [`StartActivityOptions`](../interfaces/Util.StartActivityOptions.md) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1165](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1165)

___

### startServer

▸ **startServer**(): `Promise`<`void`\>

Starts adb server if not running.

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:142](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L142)

▸ **startServer**(`cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:143](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L143)

___

### startService

▸ **startService**(`serial`, `pkg`, `service`): `Promise`<`void`\>

Starts a new service with options.
Analogous to `adb shell am startservice <pkg> <service>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |
| `service` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1197](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1197)

▸ **startService**(`serial`, `pkg`, `service`, `options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |
| `service` | `string` |
| `options` | [`StartServiceOptions`](../interfaces/Util.StartServiceOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1198](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1198)

▸ **startService**(`serial`, `pkg`, `service`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |
| `service` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1204](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1204)

▸ **startService**(`serial`, `pkg`, `service`, `options`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |
| `service` | `string` |
| `options` | [`StartServiceOptions`](../interfaces/Util.StartServiceOptions.md) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1210](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1210)

___

### swipe

▸ **swipe**(`serial`, `x1`, `y1`, `x2`, `y2`): `Promise`<`void`\>

Sends swipe input command to the device shell.
Analogous to `adb shell input touchscreen swipe x1 y1 x2 y2`.
Default input source is `touchscreen`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serial` | `string` | - |
| `x1` | `number` | Horizontal starting coordinate. |
| `y1` | `number` | Vertical starting coordinate. |
| `x2` | `number` | Horizontal ending coordinate. |
| `y2` | `number` | Vertical ending coordinate. |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:757](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L757)

▸ **swipe**(`serial`, `x1`, `y1`, `x2`, `y2`, `options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `x1` | `number` |
| `y1` | `number` |
| `x2` | `number` |
| `y2` | `number` |
| `options` | [`InputDurationOptions`](../interfaces/Util.InputDurationOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:764](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L764)

▸ **swipe**(`serial`, `x1`, `y1`, `x2`, `y2`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `x1` | `number` |
| `y1` | `number` |
| `x2` | `number` |
| `y2` | `number` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:772](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L772)

▸ **swipe**(`serial`, `x1`, `y1`, `x2`, `y2`, `options`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `x1` | `number` |
| `y1` | `number` |
| `x2` | `number` |
| `y2` | `number` |
| `options` | [`InputDurationOptions`](../interfaces/Util.InputDurationOptions.md) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:780](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L780)

___

### syncService

▸ `Private` **syncService**(`serial`): `Promise`<[`Sync`](Sync.Sync.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<[`Sync`](Sync.Sync.md)\>

#### Defined in

[src/client.ts:995](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L995)

___

### tap

▸ **tap**(`serial`, `x`, `y`): `Promise`<`void`\>

Sends tap input command to the device shell.
Analogous to `adb shell input touchscreen tap <x> <y>`.
Default input source is `touchscreen`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serial` | `string` | - |
| `x` | `number` | Horizontal coordinate. |
| `y` | `number` | Vertical coordinate. |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:888](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L888)

▸ **tap**(`serial`, `x`, `y`, `source`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `x` | `number` |
| `y` | `number` |
| `source` | [`InputSource`](../modules/Util.md#inputsource) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:889](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L889)

▸ **tap**(`serial`, `x`, `y`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `x` | `number` |
| `y` | `number` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:895](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L895)

▸ **tap**(`serial`, `x`, `y`, `source`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `x` | `number` |
| `y` | `number` |
| `source` | [`InputSource`](../modules/Util.md#inputsource) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:896](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L896)

___

### tcpip

▸ **tcpip**(`serial`): `Promise`<`void`\>

Puts the device ADB daemon into tcp mode.
Afterwards it is possible to use `connect` method.
Analogous to `adb tcpip 5555`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1377](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1377)

▸ **tcpip**(`serial`, `port`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `port` | `number` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1378](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1378)

▸ **tcpip**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1379](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1379)

▸ **tcpip**(`serial`, `port`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `port` | `number` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1380](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1380)

___

### text

▸ **text**(`serial`, `text`): `Promise`<`void`\>

Sends text input command to the device shell.
Analogous to `adb shell input touchscreen text '<text>'`.
Default input source is `touchscreen`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `text` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:929](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L929)

▸ **text**(`serial`, `text`, `source`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `text` | `string` |
| `source` | [`InputSource`](../modules/Util.md#inputsource) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:930](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L930)

▸ **text**(`serial`, `text`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `text` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:931](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L931)

▸ **text**(`serial`, `text`, `source`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `text` | `string` |
| `source` | [`InputSource`](../modules/Util.md#inputsource) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:932](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L932)

___

### touch

▸ **touch**(`serial`, `path`): `Promise`<`void`\>

Updates access and modification times of file specified by `path` parameter, or creates a new file.
Analogous to `adb shell touch <filename>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:2025](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L2025)

▸ **touch**(`serial`, `path`, `options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |
| `options` | [`TouchOptions`](../interfaces/Util.TouchOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:2026](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L2026)

▸ **touch**(`serial`, `path`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:2027](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L2027)

▸ **touch**(`serial`, `path`, `options`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `path` | `string` |
| `options` | [`TouchOptions`](../interfaces/Util.TouchOptions.md) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:2028](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L2028)

___

### trackDevices

▸ **trackDevices**(): `Promise`<[`Tracker`](Tracker.Tracker.md)\>

Tracks connection status of devices.

#### Returns

`Promise`<[`Tracker`](Tracker.Tracker.md)\>

#### Defined in

[src/client.ts:282](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L282)

▸ **trackDevices**(`cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<[`Tracker`](Tracker.Tracker.md)\> |

#### Returns

`void`

#### Defined in

[src/client.ts:283](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L283)

___

### transport

▸ **transport**(`serial`): `Promise`<[`Connection`](Connection.Connection.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<[`Connection`](Connection.Connection.md)\>

#### Defined in

[src/client.ts:185](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L185)

___

### uninstall

▸ **uninstall**(`serial`, `pkg`): `Promise`<`void`\>

Uninstalls a package from the device.
Analogous to `adb uninstall`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1098](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1098)

▸ **uninstall**(`serial`, `pkg`, `options`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |
| `options` | [`UninstallOptions`](../modules/Util.md#uninstalloptions) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1099](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1099)

▸ **uninstall**(`serial`, `pkg`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1104](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1104)

▸ **uninstall**(`serial`, `pkg`, `options`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `pkg` | `string` |
| `options` | [`UninstallOptions`](../modules/Util.md#uninstalloptions) |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1105](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1105)

___

### usb

▸ **usb**(`serial`): `Promise`<`void`\>

Sets the device transport back to usb.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1402](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1402)

▸ **usb**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1403](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1403)

___

### version

▸ **version**(): `Promise`<`number`\>

Gets the adb server version.

#### Returns

`Promise`<`number`\>

#### Defined in

[src/client.ts:194](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L194)

▸ **version**(`cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | [`ValueCallback`](../modules/Util.md#valuecallback)<`number`\> |

#### Returns

`void`

#### Defined in

[src/client.ts:195](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L195)

___

### waitBootComplete

▸ **waitBootComplete**(`serial`): `Promise`<`void`\>

Waits until the device has finished booting.

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1420](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1420)

▸ **waitBootComplete**(`serial`, `cb`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `serial` | `string` |
| `cb` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1421](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1421)

___

### waitFor

▸ **waitFor**(`transport`, `state`): `Promise`<`void`\>

Waits until the device is in the given state.
Analogous to `adb wait-for-<transport>-<state>`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `transport` | [`WaitForType`](../modules/Util.md#waitfortype) |
| `state` | [`WaitForState`](../modules/Util.md#waitforstate) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/client.ts:1435](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1435)

▸ **waitFor**(`transport`, `state`, `cb?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `transport` | [`WaitForType`](../modules/Util.md#waitfortype) |
| `state` | [`WaitForState`](../modules/Util.md#waitforstate) |
| `cb?` | [`Callback`](../modules/Util.md#callback) |

#### Returns

`void`

#### Defined in

[src/client.ts:1436](https://github.com/Maaaartin/adb-ts/blob/5393493/src/client.ts#L1436)
