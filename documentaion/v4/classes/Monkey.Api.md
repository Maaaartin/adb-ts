[adb-ts](../README.md) / [Exports](../modules.md) / [Monkey](../modules/Monkey.md) / Api

# Class: Api

[Monkey](../modules/Monkey.md).Api

## Hierarchy

- `EventEmitter`

  ↳ **`Api`**

  ↳↳ [`Monkey`](Monkey.Monkey.md)

  ↳↳ [`CommandQueue`](Monkey.CommandQueue.md)

## Table of contents

### Constructors

- [constructor](Monkey.Api.md#constructor)

### Methods

- [done](Monkey.Api.md#done)
- [flipClose](Monkey.Api.md#flipclose)
- [flipOpen](Monkey.Api.md#flipopen)
- [get](Monkey.Api.md#get)
- [getAmCurrentAction](Monkey.Api.md#getamcurrentaction)
- [getAmCurrentCategories](Monkey.Api.md#getamcurrentcategories)
- [getAmCurrentCompClass](Monkey.Api.md#getamcurrentcompclass)
- [getAmCurrentCompPackage](Monkey.Api.md#getamcurrentcomppackage)
- [getAmCurrentData](Monkey.Api.md#getamcurrentdata)
- [getAmCurrentPackage](Monkey.Api.md#getamcurrentpackage)
- [getAndParse](Monkey.Api.md#getandparse)
- [getBuildBoard](Monkey.Api.md#getbuildboard)
- [getBuildBrand](Monkey.Api.md#getbuildbrand)
- [getBuildCpuAbi](Monkey.Api.md#getbuildcpuabi)
- [getBuildDevice](Monkey.Api.md#getbuilddevice)
- [getBuildDisplay](Monkey.Api.md#getbuilddisplay)
- [getBuildFingerprint](Monkey.Api.md#getbuildfingerprint)
- [getBuildHost](Monkey.Api.md#getbuildhost)
- [getBuildId](Monkey.Api.md#getbuildid)
- [getBuildManufacturer](Monkey.Api.md#getbuildmanufacturer)
- [getBuildModel](Monkey.Api.md#getbuildmodel)
- [getBuildProduct](Monkey.Api.md#getbuildproduct)
- [getBuildTags](Monkey.Api.md#getbuildtags)
- [getBuildType](Monkey.Api.md#getbuildtype)
- [getBuildUser](Monkey.Api.md#getbuilduser)
- [getBuildVersionCodename](Monkey.Api.md#getbuildversioncodename)
- [getBuildVersionIncremental](Monkey.Api.md#getbuildversionincremental)
- [getBuildVersionRelease](Monkey.Api.md#getbuildversionrelease)
- [getBuildVersionSdk](Monkey.Api.md#getbuildversionsdk)
- [getClockMillis](Monkey.Api.md#getclockmillis)
- [getClockRealtime](Monkey.Api.md#getclockrealtime)
- [getClockUptime](Monkey.Api.md#getclockuptime)
- [getDisplayDensity](Monkey.Api.md#getdisplaydensity)
- [getDisplayHeight](Monkey.Api.md#getdisplayheight)
- [getDisplayWidth](Monkey.Api.md#getdisplaywidth)
- [keyDown](Monkey.Api.md#keydown)
- [keyUp](Monkey.Api.md#keyup)
- [list](Monkey.Api.md#list)
- [press](Monkey.Api.md#press)
- [quit](Monkey.Api.md#quit)
- [send](Monkey.Api.md#send)
- [sendAndParse](Monkey.Api.md#sendandparse)
- [sleep](Monkey.Api.md#sleep)
- [tap](Monkey.Api.md#tap)
- [touchDown](Monkey.Api.md#touchdown)
- [touchMove](Monkey.Api.md#touchmove)
- [touchUp](Monkey.Api.md#touchup)
- [trackball](Monkey.Api.md#trackball)
- [type](Monkey.Api.md#type)
- [wake](Monkey.Api.md#wake)

## Constructors

### constructor

• **new Api**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `EventEmitterOptions` |

#### Inherited from

EventEmitter.constructor

#### Defined in

node_modules/@types/node/events.d.ts:76

## Methods

### done

▸ **done**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:122](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L122)

___

### flipClose

▸ **flipClose**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:79](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L79)

___

### flipOpen

▸ **flipOpen**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:75](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L75)

___

### get

▸ **get**(`name`, `cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:110](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L110)

___

### getAmCurrentAction

▸ **getAmCurrentAction**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:129](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L129)

___

### getAmCurrentCategories

▸ **getAmCurrentCategories**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`[]\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:133](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L133)

___

### getAmCurrentCompClass

▸ **getAmCurrentCompClass**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:141](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L141)

___

### getAmCurrentCompPackage

▸ **getAmCurrentCompPackage**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:145](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L145)

___

### getAmCurrentData

▸ **getAmCurrentData**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:149](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L149)

___

### getAmCurrentPackage

▸ **getAmCurrentPackage**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:153](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L153)

___

### getAndParse

▸ `Private` **getAndParse**(`command`, `parser`, `cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | `string` |
| `parser` | `Object` |
| `parser.type` | ``"number"`` |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `number`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:13](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L13)

▸ `Private` **getAndParse**(`command`, `parser`, `cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | `string` |
| `parser` | `Object` |
| `parser.splitter` | `string` \| `RegExp` |
| `parser.type` | ``"stringArray"`` |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`[]\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:18](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L18)

___

### getBuildBoard

▸ **getBuildBoard**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:157](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L157)

___

### getBuildBrand

▸ **getBuildBrand**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:161](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L161)

___

### getBuildCpuAbi

▸ **getBuildCpuAbi**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:165](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L165)

___

### getBuildDevice

▸ **getBuildDevice**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:169](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L169)

___

### getBuildDisplay

▸ **getBuildDisplay**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:173](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L173)

___

### getBuildFingerprint

▸ **getBuildFingerprint**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:177](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L177)

___

### getBuildHost

▸ **getBuildHost**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:181](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L181)

___

### getBuildId

▸ **getBuildId**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:185](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L185)

___

### getBuildManufacturer

▸ **getBuildManufacturer**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:189](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L189)

___

### getBuildModel

▸ **getBuildModel**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:193](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L193)

___

### getBuildProduct

▸ **getBuildProduct**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:197](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L197)

___

### getBuildTags

▸ **getBuildTags**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`[]\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:201](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L201)

___

### getBuildType

▸ **getBuildType**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:209](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L209)

___

### getBuildUser

▸ **getBuildUser**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:213](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L213)

___

### getBuildVersionCodename

▸ **getBuildVersionCodename**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:217](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L217)

___

### getBuildVersionIncremental

▸ **getBuildVersionIncremental**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:221](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L221)

___

### getBuildVersionRelease

▸ **getBuildVersionRelease**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:227](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L227)

___

### getBuildVersionSdk

▸ **getBuildVersionSdk**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `number`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:231](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L231)

___

### getClockMillis

▸ **getClockMillis**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `number`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:235](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L235)

___

### getClockRealtime

▸ **getClockRealtime**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `number`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:239](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L239)

___

### getClockUptime

▸ **getClockUptime**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `number`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:243](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L243)

___

### getDisplayDensity

▸ **getDisplayDensity**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `number`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:247](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L247)

___

### getDisplayHeight

▸ **getDisplayHeight**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `number`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:251](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L251)

___

### getDisplayWidth

▸ **getDisplayWidth**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `number`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:255](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L255)

___

### keyDown

▸ **keyDown**(`keyCode`, `cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyCode` | `number` |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:51](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L51)

___

### keyUp

▸ **keyUp**(`keyCode`, `cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyCode` | `number` |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:55](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L55)

___

### list

▸ **list**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null`` \| `string`[]\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:104](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L104)

___

### press

▸ **press**(`keyCode`, `cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyCode` | `number` |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:91](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L91)

___

### quit

▸ **quit**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:118](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L118)

___

### send

▸ `Abstract` **send**<`T`\>(`command`, `cb?`): [`Api`](Monkey.Api.md)

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | `string` |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`T`\> |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:7](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L7)

___

### sendAndParse

▸ `Abstract` **sendAndParse**<`T`\>(`command`, `cb?`, `parser?`): [`Api`](Monkey.Api.md)

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | `string` |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`T`\> |
| `parser?` | (`data`: ``null`` \| `string`) => ``null`` \| `T` |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:8](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L8)

___

### sleep

▸ **sleep**(`ms`, `cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `ms` | `number` |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:114](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L114)

___

### tap

▸ **tap**(`x`, `y`, `cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:87](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L87)

___

### touchDown

▸ **touchDown**(`x`, `y`, `cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:59](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L59)

___

### touchMove

▸ **touchMove**(`x`, `y`, `cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:67](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L67)

___

### touchUp

▸ **touchUp**(`x`, `y`, `cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:63](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L63)

___

### trackball

▸ **trackball**(`dx`, `dy`, `cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `dx` | `number` |
| `dy` | `number` |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:71](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L71)

___

### type

▸ **type**(`str`, `cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:95](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L95)

___

### wake

▸ **wake**(`cb?`): [`Api`](Monkey.Api.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Api`](Monkey.Api.md)

#### Defined in

[src/monkey/api.ts:83](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L83)
