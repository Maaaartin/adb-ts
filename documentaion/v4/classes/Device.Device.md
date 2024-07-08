[adb-ts](../README.md) / [Exports](../modules.md) / [Device](../modules/Device.md) / Device

# Class: Device

[Device](../modules/Device.md).Device

## Implements

-   [`IDevice`](../interfaces/Util.IDevice.md)

## Table of contents

### Constructors

-   [constructor](Device.Device.md#constructor)

### Properties

-   [client](Device.Device.md#client)
-   [device](Device.Device.md#device)
-   [id](Device.Device.md#id)
-   [model](Device.Device.md#model)
-   [path](Device.Device.md#path)
-   [product](Device.Device.md#product)
-   [state](Device.Device.md#state)
-   [transport](Device.Device.md#transport)
-   [transportId](Device.Device.md#transportid)

### Methods

-   [batteryStatus](Device.Device.md#batterystatus)
-   [clear](Device.Device.md#clear)
-   [cp](Device.Device.md#cp)
-   [custom](Device.Device.md#custom)
-   [dragAndDrop](Device.Device.md#draganddrop)
-   [exec](Device.Device.md#exec)
-   [execShell](Device.Device.md#execshell)
-   [fileStat](Device.Device.md#filestat)
-   [forward](Device.Device.md#forward)
-   [getDevicePath](Device.Device.md#getdevicepath)
-   [getIpAddress](Device.Device.md#getipaddress)
-   [getProp](Device.Device.md#getprop)
-   [getSerialNo](Device.Device.md#getserialno)
-   [getSetting](Device.Device.md#getsetting)
-   [install](Device.Device.md#install)
-   [isInstalled](Device.Device.md#isinstalled)
-   [keyEvent](Device.Device.md#keyevent)
-   [killApp](Device.Device.md#killapp)
-   [listFeatures](Device.Device.md#listfeatures)
-   [listForwards](Device.Device.md#listforwards)
-   [listPackages](Device.Device.md#listpackages)
-   [listProperties](Device.Device.md#listproperties)
-   [listReverses](Device.Device.md#listreverses)
-   [listSettings](Device.Device.md#listsettings)
-   [mkdir](Device.Device.md#mkdir)
-   [mv](Device.Device.md#mv)
-   [openLogcat](Device.Device.md#openlogcat)
-   [openMonkey](Device.Device.md#openmonkey)
-   [openTcp](Device.Device.md#opentcp)
-   [press](Device.Device.md#press)
-   [pull](Device.Device.md#pull)
-   [pullDataFromFile](Device.Device.md#pulldatafromfile)
-   [pullFile](Device.Device.md#pullfile)
-   [push](Device.Device.md#push)
-   [pushDataToFile](Device.Device.md#pushdatatofile)
-   [pushFile](Device.Device.md#pushfile)
-   [putSetting](Device.Device.md#putsetting)
-   [readDir](Device.Device.md#readdir)
-   [reboot](Device.Device.md#reboot)
-   [remount](Device.Device.md#remount)
-   [reverse](Device.Device.md#reverse)
-   [rm](Device.Device.md#rm)
-   [roll](Device.Device.md#roll)
-   [root](Device.Device.md#root)
-   [screenshot](Device.Device.md#screenshot)
-   [setProp](Device.Device.md#setprop)
-   [shell](Device.Device.md#shell)
-   [shutdown](Device.Device.md#shutdown)
-   [startActivity](Device.Device.md#startactivity)
-   [startService](Device.Device.md#startservice)
-   [swipe](Device.Device.md#swipe)
-   [tap](Device.Device.md#tap)
-   [tcpip](Device.Device.md#tcpip)
-   [text](Device.Device.md#text)
-   [touch](Device.Device.md#touch)
-   [uninstall](Device.Device.md#uninstall)
-   [usb](Device.Device.md#usb)
-   [waitBootComplete](Device.Device.md#waitbootcomplete)

## Constructors

### constructor

• **new Device**(`client`, `props`)

#### Parameters

| Name     | Type                                       |
| :------- | :----------------------------------------- |
| `client` | [`Client`](Client.Client.md)               |
| `props`  | [`IDevice`](../interfaces/Util.IDevice.md) |

#### Defined in

[src/device.ts:52](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L52)

## Properties

### client

• `Private` `Readonly` **client**: [`Client`](Client.Client.md)

#### Defined in

[src/device.ts:50](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L50)

---

### device

• `Readonly` **device**: `undefined` \| `string`

#### Implementation of

[IDevice](../interfaces/Util.IDevice.md).[device](../interfaces/Util.IDevice.md#device)

#### Defined in

[src/device.ts:45](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L45)

---

### id

• `Readonly` **id**: `string`

#### Implementation of

[IDevice](../interfaces/Util.IDevice.md).[id](../interfaces/Util.IDevice.md#id)

#### Defined in

[src/device.ts:42](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L42)

---

### model

• `Readonly` **model**: `undefined` \| `string`

#### Implementation of

[IDevice](../interfaces/Util.IDevice.md).[model](../interfaces/Util.IDevice.md#model)

#### Defined in

[src/device.ts:46](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L46)

---

### path

• `Readonly` **path**: `undefined` \| `string`

#### Implementation of

[IDevice](../interfaces/Util.IDevice.md).[path](../interfaces/Util.IDevice.md#path)

#### Defined in

[src/device.ts:44](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L44)

---

### product

• `Readonly` **product**: `undefined` \| `string`

#### Implementation of

[IDevice](../interfaces/Util.IDevice.md).[product](../interfaces/Util.IDevice.md#product)

#### Defined in

[src/device.ts:47](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L47)

---

### state

• `Readonly` **state**: [`DeviceState`](../modules/Util.md#devicestate)

#### Implementation of

[IDevice](../interfaces/Util.IDevice.md).[state](../interfaces/Util.IDevice.md#state)

#### Defined in

[src/device.ts:43](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L43)

---

### transport

• `Readonly` **transport**: [`TransportType`](../modules/Util.md#transporttype)

#### Implementation of

[IDevice](../interfaces/Util.IDevice.md).[transport](../interfaces/Util.IDevice.md#transport)

#### Defined in

[src/device.ts:49](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L49)

---

### transportId

• `Readonly` **transportId**: `string`

#### Implementation of

[IDevice](../interfaces/Util.IDevice.md).[transportId](../interfaces/Util.IDevice.md#transportid)

#### Defined in

[src/device.ts:48](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L48)

## Methods

### batteryStatus

▸ **batteryStatus**(): `Promise`<[`PropertyMap`](../modules/Util.md#propertymap)\>

#### Returns

`Promise`<[`PropertyMap`](../modules/Util.md#propertymap)\>

#### Defined in

[src/device.ts:349](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L349)

---

### clear

▸ **clear**(`pkg`): `Promise`<`void`\>

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `pkg` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:136](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L136)

---

### cp

▸ **cp**(`srcPath`, `destPath`, `options?`): `Promise`<`void`\>

#### Parameters

| Name       | Type                                           |
| :--------- | :--------------------------------------------- |
| `srcPath`  | `string`                                       |
| `destPath` | `string`                                       |
| `options?` | [`CpOptions`](../interfaces/Util.CpOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:369](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L369)

---

### custom

▸ **custom**<`T`, `P`\>(`CustomCommand`, `...args`): `Promise`<`T`\>

#### Type parameters

| Name | Type                              |
| :--- | :-------------------------------- |
| `T`  | `T`                               |
| `P`  | extends `unknown`[] = `unknown`[] |

#### Parameters

| Name            | Type                                                                                      |
| :-------------- | :---------------------------------------------------------------------------------------- |
| `CustomCommand` | [`TransportCommandConstruct`](../interfaces/Util.TransportCommandConstruct.md)<`T`, `P`\> |
| `...args`       | `P`                                                                                       |

#### Returns

`Promise`<`T`\>

#### Defined in

[src/device.ts:322](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L322)

---

### dragAndDrop

▸ **dragAndDrop**(`x1`, `y1`, `x2`, `y2`, `options?`): `Promise`<`void`\>

#### Parameters

| Name       | Type                                                                 |
| :--------- | :------------------------------------------------------------------- |
| `x1`       | `number`                                                             |
| `y1`       | `number`                                                             |
| `x2`       | `number`                                                             |
| `y2`       | `number`                                                             |
| `options?` | [`InputDurationOptions`](../interfaces/Util.InputDurationOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:297](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L297)

---

### exec

▸ **exec**(`cmd`): `Promise`<`string`\>

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `cmd` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/device.ts:341](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L341)

---

### execShell

▸ **execShell**(`cmd`): `Promise`<`string`\>

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `cmd` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/device.ts:345](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L345)

---

### fileStat

▸ **fileStat**(`path`): `Promise`<[`FileStat`](FileStat.FileStat.md)\>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `path` | `string` |

#### Returns

`Promise`<[`FileStat`](FileStat.FileStat.md)\>

#### Defined in

[src/device.ts:373](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L373)

---

### forward

▸ **forward**(`local`, `remote`): `Promise`<`void`\>

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `local`  | `string` |
| `remote` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:88](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L88)

---

### getDevicePath

▸ **getDevicePath**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[src/device.ts:68](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L68)

---

### getIpAddress

▸ **getIpAddress**(): `Promise`<`string`[]\>

#### Returns

`Promise`<`string`[]\>

#### Defined in

[src/device.ts:84](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L84)

---

### getProp

▸ **getProp**(`prop`): `Promise`<[`PropertyValue`](../modules/Util.md#propertyvalue)\>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `prop` | `string` |

#### Returns

`Promise`<[`PropertyValue`](../modules/Util.md#propertyvalue)\>

#### Defined in

[src/device.ts:245](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L245)

---

### getSerialNo

▸ **getSerialNo**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

#### Defined in

[src/device.ts:64](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L64)

---

### getSetting

▸ **getSetting**(`mode`, `name`): `Promise`<[`PropertyValue`](../modules/Util.md#propertyvalue)\>

#### Parameters

| Name   | Type                                              |
| :----- | :------------------------------------------------ |
| `mode` | [`SettingsMode`](../modules/Util.md#settingsmode) |
| `name` | `string`                                          |

#### Returns

`Promise`<[`PropertyValue`](../modules/Util.md#propertyvalue)\>

#### Defined in

[src/device.ts:253](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L253)

---

### install

▸ **install**(`apk`): `Promise`<`void`\>

#### Parameters

| Name  | Type                   |
| :---- | :--------------------- |
| `apk` | `string` \| `Readable` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:140](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L140)

▸ **install**(`apk`, `options?`): `Promise`<`void`\>

#### Parameters

| Name       | Type                                                  |
| :--------- | :---------------------------------------------------- |
| `apk`      | `string` \| `Readable`                                |
| `options?` | [`InstallOptions`](../modules/Util.md#installoptions) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:141](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L141)

▸ **install**(`apk`, `options?`, `args?`): `Promise`<`void`\>

#### Parameters

| Name       | Type                                                  |
| :--------- | :---------------------------------------------------- |
| `apk`      | `string` \| `Readable`                                |
| `options?` | [`InstallOptions`](../modules/Util.md#installoptions) |
| `args?`    | `string`                                              |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:142](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L142)

---

### isInstalled

▸ **isInstalled**(`pkg`): `Promise`<`boolean`\>

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `pkg` | `string` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[src/device.ts:164](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L164)

---

### keyEvent

▸ **keyEvent**(`code`, `options?`): `Promise`<`void`\>

#### Parameters

| Name       | Type                                                                       |
| :--------- | :------------------------------------------------------------------------- |
| `code`     | `number` \| [`NonEmptyArray`](../modules/Util.md#nonemptyarray)<`number`\> |
| `options?` | [`KeyEventOptions`](../interfaces/Util.KeyEventOptions.md)                 |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:273](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L273)

---

### killApp

▸ **killApp**(`pkg`): `Promise`<`void`\>

#### Parameters

| Name  | Type     |
| :---- | :------- |
| `pkg` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:337](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L337)

---

### listFeatures

▸ **listFeatures**(): `Promise`<[`PropertyMap`](../modules/Util.md#propertymap)\>

#### Returns

`Promise`<[`PropertyMap`](../modules/Util.md#propertymap)\>

#### Defined in

[src/device.ts:76](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L76)

---

### listForwards

▸ **listForwards**(): `Promise`<[`ForwardsObject`](../interfaces/Util.ForwardsObject.md)[]\>

#### Returns

`Promise`<[`ForwardsObject`](../interfaces/Util.ForwardsObject.md)[]\>

#### Defined in

[src/device.ts:92](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L92)

---

### listPackages

▸ **listPackages**(): `Promise`<`string`[]\>

#### Returns

`Promise`<`string`[]\>

#### Defined in

[src/device.ts:80](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L80)

---

### listProperties

▸ **listProperties**(): `Promise`<[`PropertyMap`](../modules/Util.md#propertymap)\>

#### Returns

`Promise`<[`PropertyMap`](../modules/Util.md#propertymap)\>

#### Defined in

[src/device.ts:72](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L72)

---

### listReverses

▸ **listReverses**(): `Promise`<[`ReversesObject`](../interfaces/Util.ReversesObject.md)[]\>

#### Returns

`Promise`<[`ReversesObject`](../interfaces/Util.ReversesObject.md)[]\>

#### Defined in

[src/device.ts:100](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L100)

---

### listSettings

▸ **listSettings**(`mode`): `Promise`<[`PropertyMap`](../modules/Util.md#propertymap)\>

#### Parameters

| Name   | Type                                              |
| :----- | :------------------------------------------------ |
| `mode` | [`SettingsMode`](../modules/Util.md#settingsmode) |

#### Returns

`Promise`<[`PropertyMap`](../modules/Util.md#propertymap)\>

#### Defined in

[src/device.ts:241](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L241)

---

### mkdir

▸ **mkdir**(`path`, `options?`): `Promise`<`void`\>

#### Parameters

| Name       | Type                                                 |
| :--------- | :--------------------------------------------------- |
| `path`     | `string`                                             |
| `options?` | [`MkDirOptions`](../interfaces/Util.MkDirOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:357](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L357)

---

### mv

▸ **mv**(`srcPath`, `destPath`, `options?`): `Promise`<`void`\>

#### Parameters

| Name       | Type                                           |
| :--------- | :--------------------------------------------- |
| `srcPath`  | `string`                                       |
| `destPath` | `string`                                       |
| `options?` | [`MvOptions`](../interfaces/Util.MvOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:365](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L365)

---

### openLogcat

▸ **openLogcat**(`options?`): `Promise`<[`LogcatReader`](Logcat.LogcatReader.md)\>

#### Parameters

| Name       | Type                                                |
| :--------- | :-------------------------------------------------- |
| `options?` | [`LogcatOptions`](../modules/Util.md#logcatoptions) |

#### Returns

`Promise`<[`LogcatReader`](Logcat.LogcatReader.md)\>

#### Defined in

[src/device.ts:132](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L132)

---

### openMonkey

▸ **openMonkey**(): `Promise`<[`Monkey`](Monkey.Monkey.md)\>

#### Returns

`Promise`<[`Monkey`](Monkey.Monkey.md)\>

#### Defined in

[src/device.ts:333](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L333)

---

### openTcp

▸ **openTcp**(`port`, `host?`): `Promise`<[`Connection`](Connection.Connection.md)\>

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `port`  | `number` |
| `host?` | `string` |

#### Returns

`Promise`<[`Connection`](Connection.Connection.md)\>

#### Defined in

[src/device.ts:128](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L128)

---

### press

▸ **press**(`source?`): `Promise`<`void`\>

#### Parameters

| Name      | Type                                            |
| :-------- | :---------------------------------------------- |
| `source?` | [`InputSource`](../modules/Util.md#inputsource) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:314](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L314)

---

### pull

▸ **pull**(`path`): `Promise`<[`PullTransfer`](Sync.PullTransfer.md)\>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `path` | `string` |

#### Returns

`Promise`<[`PullTransfer`](Sync.PullTransfer.md)\>

#### Defined in

[src/device.ts:217](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L217)

---

### pullDataFromFile

▸ **pullDataFromFile**(`srcPath`): `Promise`<`Buffer`\>

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `srcPath` | `string` |

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[src/device.ts:209](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L209)

---

### pullFile

▸ **pullFile**(`srcPath`, `destPath`): `Promise`<`void`\>

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `srcPath`  | `string` |
| `destPath` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:213](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L213)

---

### push

▸ **push**(`srcPath`, `destPath`, `mode?`): `Promise`<[`PushTransfer`](Sync.PushTransfer.md)\>

#### Parameters

| Name       | Type                                                                                                                                    |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| `srcPath`  | `string` \| `Readable`                                                                                                                  |
| `destPath` | `string`                                                                                                                                |
| `mode?`    | [`SyncMode`](../enums/Sync.SyncMode.md) \| [`ValueCallback`](../modules/Util.md#valuecallback)<[`PushTransfer`](Sync.PushTransfer.md)\> |

#### Returns

`Promise`<[`PushTransfer`](Sync.PushTransfer.md)\>

#### Defined in

[src/device.ts:221](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L221)

---

### pushDataToFile

▸ **pushDataToFile**(`data`, `destPath`): `Promise`<`void`\>

#### Parameters

| Name       | Type                               |
| :--------- | :--------------------------------- |
| `data`     | `string` \| `Buffer` \| `Readable` |
| `destPath` | `string`                           |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:198](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L198)

---

### pushFile

▸ **pushFile**(`srcPath`, `destPath`): `Promise`<`void`\>

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `srcPath`  | `string` |
| `destPath` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:205](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L205)

---

### putSetting

▸ **putSetting**(`mode`, `name`, `value`): `Promise`<`void`\>

#### Parameters

| Name    | Type                                                |
| :------ | :-------------------------------------------------- |
| `mode`  | [`SettingsMode`](../modules/Util.md#settingsmode)   |
| `name`  | `string`                                            |
| `value` | [`PrimitiveType`](../modules/Util.md#primitivetype) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:257](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L257)

---

### readDir

▸ **readDir**(`path`): `Promise`<[`SyncEntry`](Sync.SyncEntry.md)[]\>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `path` | `string` |

#### Returns

`Promise`<[`SyncEntry`](Sync.SyncEntry.md)[]\>

#### Defined in

[src/device.ts:194](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L194)

---

### reboot

▸ **reboot**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:108](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L108)

---

### remount

▸ **remount**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:116](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L116)

---

### reverse

▸ **reverse**(`local`, `remote`): `Promise`<`void`\>

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `local`  | `string` |
| `remote` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:96](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L96)

---

### rm

▸ **rm**(`path`, `options?`): `Promise`<`void`\>

#### Parameters

| Name       | Type                                           |
| :--------- | :--------------------------------------------- |
| `path`     | `string`                                       |
| `options?` | [`RmOptions`](../interfaces/Util.RmOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:353](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L353)

---

### roll

▸ **roll**(`x`, `y`, `source?`): `Promise`<`void`\>

#### Parameters

| Name      | Type                                            |
| :-------- | :---------------------------------------------- |
| `x`       | `number`                                        |
| `y`       | `number`                                        |
| `source?` | [`InputSource`](../modules/Util.md#inputsource) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:318](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L318)

---

### root

▸ **root**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:120](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L120)

---

### screenshot

▸ **screenshot**(): `Promise`<`Buffer`\>

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[src/device.ts:124](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L124)

---

### setProp

▸ **setProp**(`prop`, `value`): `Promise`<`void`\>

#### Parameters

| Name    | Type                                                |
| :------ | :-------------------------------------------------- |
| `prop`  | `string`                                            |
| `value` | [`PrimitiveType`](../modules/Util.md#primitivetype) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:249](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L249)

---

### shell

▸ **shell**(`command`): `Promise`<`string`\>

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `command` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/device.ts:104](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L104)

---

### shutdown

▸ **shutdown**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:112](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L112)

---

### startActivity

▸ **startActivity**(`pkg`, `activity`, `options?`): `Promise`<`void`\>

#### Parameters

| Name       | Type                                                                 |
| :--------- | :------------------------------------------------------------------- |
| `pkg`      | `string`                                                             |
| `activity` | `string`                                                             |
| `options?` | [`StartActivityOptions`](../interfaces/Util.StartActivityOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:168](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L168)

---

### startService

▸ **startService**(`pkg`, `service`, `options?`): `Promise`<`void`\>

#### Parameters

| Name       | Type                                                               |
| :--------- | :----------------------------------------------------------------- |
| `pkg`      | `string`                                                           |
| `service`  | `string`                                                           |
| `options?` | [`StartServiceOptions`](../interfaces/Util.StartServiceOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:181](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L181)

---

### swipe

▸ **swipe**(`x1`, `y1`, `x2`, `y2`, `options?`): `Promise`<`void`\>

#### Parameters

| Name       | Type                                                                 |
| :--------- | :------------------------------------------------------------------- |
| `x1`       | `number`                                                             |
| `y1`       | `number`                                                             |
| `x2`       | `number`                                                             |
| `y2`       | `number`                                                             |
| `options?` | [`InputDurationOptions`](../interfaces/Util.InputDurationOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:280](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L280)

---

### tap

▸ **tap**(`x`, `y`, `source?`): `Promise`<`void`\>

#### Parameters

| Name      | Type                                            |
| :-------- | :---------------------------------------------- |
| `x`       | `number`                                        |
| `y`       | `number`                                        |
| `source?` | [`InputSource`](../modules/Util.md#inputsource) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:265](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L265)

---

### tcpip

▸ **tcpip**(`port?`): `Promise`<`void`\>

#### Parameters

| Name   | Type     | Default value |
| :----- | :------- | :------------ |
| `port` | `number` | `5555`        |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:229](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L229)

---

### text

▸ **text**(`text`, `source?`): `Promise`<`void`\>

#### Parameters

| Name      | Type                                            |
| :-------- | :---------------------------------------------- |
| `text`    | `string`                                        |
| `source?` | [`InputSource`](../modules/Util.md#inputsource) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:269](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L269)

---

### touch

▸ **touch**(`path`, `options?`): `Promise`<`void`\>

#### Parameters

| Name       | Type                                                 |
| :--------- | :--------------------------------------------------- |
| `path`     | `string`                                             |
| `options?` | [`TouchOptions`](../interfaces/Util.TouchOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:361](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L361)

---

### uninstall

▸ **uninstall**(`pkg`, `options?`): `Promise`<`void`\>

#### Parameters

| Name       | Type                                                      |
| :--------- | :-------------------------------------------------------- |
| `pkg`      | `string`                                                  |
| `options?` | [`UninstallOptions`](../modules/Util.md#uninstalloptions) |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:160](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L160)

---

### usb

▸ **usb**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:233](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L233)

---

### waitBootComplete

▸ **waitBootComplete**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/device.ts:237](https://github.com/Maaaartin/adb-ts/blob/5393493/src/device.ts#L237)
