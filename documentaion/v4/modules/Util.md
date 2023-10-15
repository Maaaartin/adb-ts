[adb-ts](../README.md) / [Exports](../modules.md) / Util

# Namespace: Util

## Table of contents

### Enumerations

- [KeyCode](../enums/Util.KeyCode.md)
- [Reply](../enums/Util.Reply.md)

### Classes

- [AdbError](../classes/Util.AdbError.md)
- [AdbExecError](../classes/Util.AdbExecError.md)
- [NotConnectedError](../classes/Util.NotConnectedError.md)
- [PrematureEOFError](../classes/Util.PrematureEOFError.md)
- [UnexpectedDataError](../classes/Util.UnexpectedDataError.md)

### Interfaces

- [CommandConstruct](../interfaces/Util.CommandConstruct.md)
- [CpOptions](../interfaces/Util.CpOptions.md)
- [ForceFSOption](../interfaces/Util.ForceFSOption.md)
- [ForwardsObject](../interfaces/Util.ForwardsObject.md)
- [IDevice](../interfaces/Util.IDevice.md)
- [InputDurationOptions](../interfaces/Util.InputDurationOptions.md)
- [InputOptions](../interfaces/Util.InputOptions.md)
- [IpConnectConstruct](../interfaces/Util.IpConnectConstruct.md)
- [KeyEventOptions](../interfaces/Util.KeyEventOptions.md)
- [MkDirOptions](../interfaces/Util.MkDirOptions.md)
- [MvOptions](../interfaces/Util.MvOptions.md)
- [NoClobberFSOption](../interfaces/Util.NoClobberFSOption.md)
- [RecursiveFSOption](../interfaces/Util.RecursiveFSOption.md)
- [ReversesForwardsBase](../interfaces/Util.ReversesForwardsBase.md)
- [ReversesObject](../interfaces/Util.ReversesObject.md)
- [RmOptions](../interfaces/Util.RmOptions.md)
- [StartActivityOptions](../interfaces/Util.StartActivityOptions.md)
- [StartServiceOptions](../interfaces/Util.StartServiceOptions.md)
- [SymlinkFSoption](../interfaces/Util.SymlinkFSoption.md)
- [TouchOptions](../interfaces/Util.TouchOptions.md)
- [TransportCommandConstruct](../interfaces/Util.TransportCommandConstruct.md)

### Type Aliases

- [AdbClientOptions](Util.md#adbclientoptions)
- [AdbClientOptionsValues](Util.md#adbclientoptionsvalues)
- [ArgsMapper](Util.md#argsmapper)
- [Callback](Util.md#callback)
- [DeviceState](Util.md#devicestate)
- [ExtraType](Util.md#extratype)
- [InputSource](Util.md#inputsource)
- [InputType](Util.md#inputtype)
- [InstallOptions](Util.md#installoptions)
- [LogcatOptions](Util.md#logcatoptions)
- [LogcatReaderOptions](Util.md#logcatreaderoptions)
- [MonkeyCallback](Util.md#monkeycallback)
- [NonEmptyArray](Util.md#nonemptyarray)
- [NonFunctionProperties](Util.md#nonfunctionproperties)
- [NonFunctionPropertyNames](Util.md#nonfunctionpropertynames)
- [NonNullable](Util.md#nonnullable)
- [ObjectEntries](Util.md#objectentries)
- [PreserveOptions](Util.md#preserveoptions)
- [PrimitiveDictionary](Util.md#primitivedictionary)
- [PrimitiveType](Util.md#primitivetype)
- [PropertyMap](Util.md#propertymap)
- [PropertyValue](Util.md#propertyvalue)
- [SettingsMode](Util.md#settingsmode)
- [StartExtra](Util.md#startextra)
- [StatsObject](Util.md#statsobject)
- [TransportType](Util.md#transporttype)
- [UninstallOptions](Util.md#uninstalloptions)
- [ValueCallback](Util.md#valuecallback)
- [WaitForState](Util.md#waitforstate)
- [WaitForType](Util.md#waitfortype)

### Functions

- [buildFsParams](Util.md#buildfsparams)
- [buildInputParams](Util.md#buildinputparams)
- [decodeLength](Util.md#decodelength)
- [encodeData](Util.md#encodedata)
- [encodeLength](Util.md#encodelength)
- [escape](Util.md#escape)
- [escapeCompat](Util.md#escapecompat)
- [findMatches](Util.md#findmatches)
- [nodeify](Util.md#nodeify)
- [parseCbParam](Util.md#parsecbparam)
- [parsePrimitiveParam](Util.md#parseprimitiveparam)
- [parseValueParam](Util.md#parsevalueparam)
- [stringToType](Util.md#stringtotype)

## Type Aliases

### AdbClientOptions

Ƭ **AdbClientOptions**: { [K in keyof AdbClientOptionsValues]?: AdbClientOptionsValues[K] }

**`See`**

[AdbClientOptionsValues](Util.md#adbclientoptionsvalues)

#### Defined in

[src/util/types.ts:192](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L192)

___

### AdbClientOptionsValues

Ƭ **AdbClientOptionsValues**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `bin` | `string` | - *path to adb.exe, if not set, env path is taken* |
| `host` | `string` | - *default `localhost`* |
| `noAutoStart` | `boolean` | - *if false, module will not attempt to start adb server* |
| `port` | `number` | - *default `5037`* |

#### Defined in

[src/util/types.ts:170](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L170)

___

### ArgsMapper

Ƭ **ArgsMapper**<`T`\>: { [K in keyof T]-?: string \| Function }

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |

#### Defined in

[src/util/types.ts:433](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L433)

___

### Callback

Ƭ **Callback**: (`err`: ``null`` \| `Error`) => `void`

#### Type declaration

▸ (`err`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | ``null`` \| `Error` |

##### Returns

`void`

#### Defined in

[src/util/types.ts:20](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L20)

___

### DeviceState

Ƭ **DeviceState**: ``"offline"`` \| ``"device"`` \| ``"emulator"`` \| ``"unauthorized"`` \| ``"recovery"`` \| ``"no permissions"``

#### Defined in

[src/util/types.ts:24](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L24)

___

### ExtraType

Ƭ **ExtraType**: ``"string"`` \| ``"null"`` \| ``"bool"`` \| ``"int"`` \| ``"long"`` \| ``"float"`` \| ``"uri"`` \| ``"component"``

#### Defined in

[src/util/types.ts:32](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L32)

___

### InputSource

Ƭ **InputSource**: ``"dpad"`` \| ``"keyboard"`` \| ``"mouse"`` \| ``"touchpad"`` \| ``"gamepad"`` \| ``"touchnavigation"`` \| ``"joystick"`` \| ``"touchscreen"`` \| ``"stylus"`` \| ``"trackball"``

#### Defined in

[src/util/types.ts:227](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L227)

___

### InputType

Ƭ **InputType**: ``"text"`` \| ``"keyevent"`` \| ``"tap"`` \| ``"swipe"`` \| ``"draganddrop"`` \| ``"press"`` \| ``"roll"``

#### Defined in

[src/util/types.ts:239](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L239)

___

### InstallOptions

Ƭ **InstallOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `allowDowngrade?` | `boolean` | Adds `-d` flag to the install command. |
| `grandPermissions?` | `boolean` | Adds `-g` flag to the install command. |
| `internal?` | `boolean` | Adds `-f` flag to the install command. |
| `reinstall?` | `boolean` | Adds `-r` flag to the install command. |
| `test?` | `boolean` | Adds `-t` flag to the install command. |

#### Defined in

[src/util/types.ts:140](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L140)

___

### LogcatOptions

Ƭ **LogcatOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `clear?` | `boolean` |
| `filter?` | (`entry`: [`LogcatEntry`](../classes/Logcat.LogcatEntry.md)) => `boolean` |

#### Defined in

[src/util/types.ts:196](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L196)

___

### LogcatReaderOptions

Ƭ **LogcatReaderOptions**: `Object`

**`See`**

[LogcatOptions](Util.md#logcatoptions)

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filter?` | (`entry`: [`LogcatEntry`](../classes/Logcat.LogcatEntry.md)) => `boolean` |

#### Defined in

[src/util/types.ts:209](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L209)

___

### MonkeyCallback

Ƭ **MonkeyCallback**<`T`\>: (`err`: `Error` \| ``null``, `value`: `T` \| ``null``, `command`: `string`) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | ``null`` |

#### Type declaration

▸ (`err`, `value`, `command`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` \| ``null`` |
| `value` | `T` \| ``null`` |
| `command` | `string` |

##### Returns

`void`

#### Defined in

[src/util/types.ts:280](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L280)

___

### NonEmptyArray

Ƭ **NonEmptyArray**<`T`\>: [`T`, ...T[]]

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/util/types.ts:68](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L68)

___

### NonFunctionProperties

Ƭ **NonFunctionProperties**<`T`\>: `Pick`<`T`, [`NonFunctionPropertyNames`](Util.md#nonfunctionpropertynames)<`T`\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/util/types.ts:429](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L429)

___

### NonFunctionPropertyNames

Ƭ **NonFunctionPropertyNames**<`T`\>: { [K in keyof T]: T[K] extends Function ? never : K }[keyof `T`]

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/util/types.ts:425](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L425)

___

### NonNullable

Ƭ **NonNullable**<`T`\>: `Exclude`<`T`, `undefined`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[src/util/types.ts:431](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L431)

___

### ObjectEntries

Ƭ **ObjectEntries**<`T`\>: [[keyof `T`, `T`[keyof `T`]]]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |

#### Defined in

[src/util/types.ts:442](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L442)

___

### PreserveOptions

Ƭ **PreserveOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `all?` | `boolean` | All of other options. |
| `context?` | `boolean` | - |
| `mode?` | `boolean` | - |
| `ownership?` | `boolean` | - |
| `timestamps?` | `boolean` | - |
| `xattr?` | `boolean` | - |

#### Defined in

[src/util/types.ts:356](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L356)

___

### PrimitiveDictionary

Ƭ **PrimitiveDictionary**: `Record`<`string`, [`PropertyValue`](Util.md#propertyvalue)\>

#### Defined in

[src/util/types.ts:138](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L138)

___

### PrimitiveType

Ƭ **PrimitiveType**: `string` \| `boolean` \| `number` \| ``null`` \| `undefined`

#### Defined in

[src/util/types.ts:134](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L134)

___

### PropertyMap

Ƭ **PropertyMap**: `Map`<`string`, [`PropertyValue`](Util.md#propertyvalue)\>

#### Defined in

[src/util/types.ts:423](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L423)

___

### PropertyValue

Ƭ **PropertyValue**: [`PrimitiveType`](Util.md#primitivetype) \| `Date`

#### Defined in

[src/util/types.ts:136](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L136)

___

### SettingsMode

Ƭ **SettingsMode**: ``"system"`` \| ``"global"`` \| ``"secure"``

#### Defined in

[src/util/types.ts:225](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L225)

___

### StartExtra

Ƭ **StartExtra**: { `key`: `string` ; `type`: ``"null"``  } \| { `key`: `string` ; `type`: ``"bool"`` ; `value`: `boolean`  } \| { `key`: `string` ; `type`: ``"int"`` \| ``"long"`` \| ``"float"`` ; `value`: `number` \| `number`[]  } \| { `key`: `string` ; `type`: ``"string"`` ; `value`: `string` \| `string`[]  } \| { `key`: `string` ; `type`: ``"component"`` \| ``"uri"`` ; `value`: `string`  }

#### Defined in

[src/util/types.ts:42](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L42)

___

### StatsObject

Ƭ **StatsObject**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `bytesTransferred` | `number` |

#### Defined in

[src/util/types.ts:117](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L117)

___

### TransportType

Ƭ **TransportType**: ``"usb"`` \| ``"local"``

#### Defined in

[src/util/types.ts:213](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L213)

___

### UninstallOptions

Ƭ **UninstallOptions**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `keepCache?` | `boolean` | Adds `-k` flag to the install command. |

#### Defined in

[src/util/types.ts:163](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L163)

___

### ValueCallback

Ƭ **ValueCallback**<`T`\>: (`err`: ``null`` \| `Error`, `value`: `T`) => `void`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`err`, `value`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | ``null`` \| `Error` |
| `value` | `T` |

##### Returns

`void`

#### Defined in

[src/util/types.ts:22](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L22)

___

### WaitForState

Ƭ **WaitForState**: ``"device"`` \| ``"recovery"`` \| ``"rescue"`` \| ``"sideload"`` \| ``"bootloader"`` \| ``"disconnect"``

#### Defined in

[src/util/types.ts:217](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L217)

___

### WaitForType

Ƭ **WaitForType**: [`TransportType`](Util.md#transporttype) \| ``"any"``

#### Defined in

[src/util/types.ts:215](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L215)

## Functions

### buildFsParams

▸ **buildFsParams**<`T`\>(`options`, `cb`): `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | `undefined` \| [`Callback`](Util.md#callback) \| `T` |
| `cb` | `undefined` \| [`Callback`](Util.md#callback) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `cb_` | [`Callback`](Util.md#callback) \| `undefined` |
| `options_` | `T` \| `undefined` |

#### Defined in

[src/util/functions.ts:118](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/functions.ts#L118)

___

### buildInputParams

▸ **buildInputParams**<`T`\>(`params`, `cb`): `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`InputSource`](Util.md#inputsource) \| [`InputOptions`](../interfaces/Util.InputOptions.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `undefined` \| [`Callback`](Util.md#callback) \| `T` |
| `cb` | `undefined` \| [`Callback`](Util.md#callback) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `cb_` | [`Callback`](Util.md#callback) \| `undefined` |
| `params` | `T` \| `undefined` |

#### Defined in

[src/util/functions.ts:134](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/functions.ts#L134)

___

### decodeLength

▸ **decodeLength**(`length`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `length` | `string` |

#### Returns

`number`

#### Defined in

[src/util/functions.ts:13](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/functions.ts#L13)

___

### encodeData

▸ **encodeData**(`data`): `Buffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` \| `Buffer` |

#### Returns

`Buffer`

#### Defined in

[src/util/functions.ts:21](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/functions.ts#L21)

___

### encodeLength

▸ **encodeLength**(`length`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `length` | `number` |

#### Returns

`string`

#### Defined in

[src/util/functions.ts:17](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/functions.ts#L17)

___

### escape

▸ **escape**(`arg`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg` | [`PrimitiveType`](Util.md#primitivetype) |

#### Returns

`string`

#### Defined in

[src/util/functions.ts:150](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/functions.ts#L150)

___

### escapeCompat

▸ **escapeCompat**(`arg`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `arg` | [`PrimitiveType`](Util.md#primitivetype) |

#### Returns

`string`

#### Defined in

[src/util/functions.ts:161](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/functions.ts#L161)

___

### findMatches

▸ **findMatches**(`value`, `regExp`, `parseTo`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |
| `regExp` | `RegExp` |
| `parseTo` | ``"list"`` |

#### Returns

`string`[]

#### Defined in

[src/util/functions.ts:80](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/functions.ts#L80)

▸ **findMatches**(`value`, `regExp`, `parseTo`): [`PropertyMap`](Util.md#propertymap)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |
| `regExp` | `RegExp` |
| `parseTo` | ``"map"`` |

#### Returns

[`PropertyMap`](Util.md#propertymap)

#### Defined in

[src/util/functions.ts:85](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/functions.ts#L85)

▸ **findMatches**(`value`, `regExp`): `string`[][]

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |
| `regExp` | `RegExp` |

#### Returns

`string`[][]

#### Defined in

[src/util/functions.ts:90](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/functions.ts#L90)

___

### nodeify

▸ **nodeify**<`T`\>(`promise`, `cb`): `void` \| `Promise`<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `promise` | `Promise`<`T`\> |
| `cb` | `undefined` \| (`err`: ``null`` \| `Error`, `value`: `T`) => `void` |

#### Returns

`void` \| `Promise`<`T`\>

#### Defined in

[src/util/functions.ts:47](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/functions.ts#L47)

___

### parseCbParam

▸ **parseCbParam**<`T`, `R`\>(`param`, `cb`): `undefined` \| [`ValueCallback`](Util.md#valuecallback)<`R`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| [`NonFunctionProperties`](Util.md#nonfunctionproperties)<`T`\> |
| `R` | `R` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `param` | `undefined` \| `T` \| [`ValueCallback`](Util.md#valuecallback)<`R`\> |
| `cb` | `undefined` \| [`ValueCallback`](Util.md#valuecallback)<`R`\> |

#### Returns

`undefined` \| [`ValueCallback`](Util.md#valuecallback)<`R`\>

#### Defined in

[src/util/functions.ts:63](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/functions.ts#L63)

___

### parsePrimitiveParam

▸ **parsePrimitiveParam**<`T`\>(`def`, `param`): `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `def` | `T` |
| `param` | `undefined` \| `T` |

#### Returns

`T`

#### Defined in

[src/util/functions.ts:73](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/functions.ts#L73)

___

### parseValueParam

▸ **parseValueParam**<`T`, `R`\>(`param`): `undefined` \| `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` \| [`NonFunctionProperties`](Util.md#nonfunctionproperties)<`T`\> |
| `R` | `R` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `param` | `undefined` \| `T` \| [`ValueCallback`](Util.md#valuecallback)<`R`\> \| [`Callback`](Util.md#callback) |

#### Returns

`undefined` \| `T`

#### Defined in

[src/util/functions.ts:54](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/functions.ts#L54)

___

### stringToType

▸ **stringToType**(`value?`): [`PropertyValue`](Util.md#propertyvalue)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `value` | `string` | `''` |

#### Returns

[`PropertyValue`](Util.md#propertyvalue)

#### Defined in

[src/util/functions.ts:28](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/functions.ts#L28)
