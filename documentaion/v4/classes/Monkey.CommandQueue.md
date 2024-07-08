[adb-ts](../README.md) / [Exports](../modules.md) / [Monkey](../modules/Monkey.md) / CommandQueue

# Class: CommandQueue

[Monkey](../modules/Monkey.md).CommandQueue

## Hierarchy

-   [`Api`](Monkey.Api.md)

    ↳ **`CommandQueue`**

## Table of contents

### Constructors

-   [constructor](Monkey.CommandQueue.md#constructor)

### Properties

-   [callback](Monkey.CommandQueue.md#callback)
-   [client](Monkey.CommandQueue.md#client)
-   [commands](Monkey.CommandQueue.md#commands)
-   [errors](Monkey.CommandQueue.md#errors)
-   [replies](Monkey.CommandQueue.md#replies)
-   [sent](Monkey.CommandQueue.md#sent)

### Accessors

-   [queue](Monkey.CommandQueue.md#queue)

### Methods

-   [collector](Monkey.CommandQueue.md#collector)
-   [done](Monkey.CommandQueue.md#done)
-   [execute](Monkey.CommandQueue.md#execute)
-   [flipClose](Monkey.CommandQueue.md#flipclose)
-   [flipOpen](Monkey.CommandQueue.md#flipopen)
-   [forbidReuse](Monkey.CommandQueue.md#forbidreuse)
-   [get](Monkey.CommandQueue.md#get)
-   [getAmCurrentAction](Monkey.CommandQueue.md#getamcurrentaction)
-   [getAmCurrentCategories](Monkey.CommandQueue.md#getamcurrentcategories)
-   [getAmCurrentCompClass](Monkey.CommandQueue.md#getamcurrentcompclass)
-   [getAmCurrentCompPackage](Monkey.CommandQueue.md#getamcurrentcomppackage)
-   [getAmCurrentData](Monkey.CommandQueue.md#getamcurrentdata)
-   [getAmCurrentPackage](Monkey.CommandQueue.md#getamcurrentpackage)
-   [getBuildBoard](Monkey.CommandQueue.md#getbuildboard)
-   [getBuildBrand](Monkey.CommandQueue.md#getbuildbrand)
-   [getBuildCpuAbi](Monkey.CommandQueue.md#getbuildcpuabi)
-   [getBuildDevice](Monkey.CommandQueue.md#getbuilddevice)
-   [getBuildDisplay](Monkey.CommandQueue.md#getbuilddisplay)
-   [getBuildFingerprint](Monkey.CommandQueue.md#getbuildfingerprint)
-   [getBuildHost](Monkey.CommandQueue.md#getbuildhost)
-   [getBuildId](Monkey.CommandQueue.md#getbuildid)
-   [getBuildManufacturer](Monkey.CommandQueue.md#getbuildmanufacturer)
-   [getBuildModel](Monkey.CommandQueue.md#getbuildmodel)
-   [getBuildProduct](Monkey.CommandQueue.md#getbuildproduct)
-   [getBuildTags](Monkey.CommandQueue.md#getbuildtags)
-   [getBuildType](Monkey.CommandQueue.md#getbuildtype)
-   [getBuildUser](Monkey.CommandQueue.md#getbuilduser)
-   [getBuildVersionCodename](Monkey.CommandQueue.md#getbuildversioncodename)
-   [getBuildVersionIncremental](Monkey.CommandQueue.md#getbuildversionincremental)
-   [getBuildVersionRelease](Monkey.CommandQueue.md#getbuildversionrelease)
-   [getBuildVersionSdk](Monkey.CommandQueue.md#getbuildversionsdk)
-   [getClockMillis](Monkey.CommandQueue.md#getclockmillis)
-   [getClockRealtime](Monkey.CommandQueue.md#getclockrealtime)
-   [getClockUptime](Monkey.CommandQueue.md#getclockuptime)
-   [getCommands](Monkey.CommandQueue.md#getcommands)
-   [getDisplayDensity](Monkey.CommandQueue.md#getdisplaydensity)
-   [getDisplayHeight](Monkey.CommandQueue.md#getdisplayheight)
-   [getDisplayWidth](Monkey.CommandQueue.md#getdisplaywidth)
-   [keyDown](Monkey.CommandQueue.md#keydown)
-   [keyUp](Monkey.CommandQueue.md#keyup)
-   [list](Monkey.CommandQueue.md#list)
-   [maybeFinish](Monkey.CommandQueue.md#maybefinish)
-   [press](Monkey.CommandQueue.md#press)
-   [pushCommands](Monkey.CommandQueue.md#pushcommands)
-   [quit](Monkey.CommandQueue.md#quit)
-   [send](Monkey.CommandQueue.md#send)
-   [sendAndParse](Monkey.CommandQueue.md#sendandparse)
-   [sendInternal](Monkey.CommandQueue.md#sendinternal)
-   [sleep](Monkey.CommandQueue.md#sleep)
-   [tap](Monkey.CommandQueue.md#tap)
-   [touchDown](Monkey.CommandQueue.md#touchdown)
-   [touchMove](Monkey.CommandQueue.md#touchmove)
-   [touchUp](Monkey.CommandQueue.md#touchup)
-   [trackball](Monkey.CommandQueue.md#trackball)
-   [type](Monkey.CommandQueue.md#type)
-   [wake](Monkey.CommandQueue.md#wake)

## Constructors

### constructor

• **new CommandQueue**(`client`)

#### Parameters

| Name     | Type                         |
| :------- | :--------------------------- |
| `client` | [`Monkey`](Monkey.Monkey.md) |

#### Overrides

[Api](Monkey.Api.md).[constructor](Monkey.Api.md#constructor)

#### Defined in

[src/monkey/commandqueue.ts:12](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L12)

## Properties

### callback

• `Private` `Optional` **callback**: (`err`: `null` \| `Error`, `data`: `unknown`[]) => `void`

#### Type declaration

▸ (`err`, `data`): `void`

##### Parameters

| Name   | Type              |
| :----- | :---------------- |
| `err`  | `null` \| `Error` |
| `data` | `unknown`[]       |

##### Returns

`void`

#### Defined in

[src/monkey/commandqueue.ts:11](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L11)

---

### client

• `Private` **client**: [`Monkey`](Monkey.Monkey.md)

#### Defined in

[src/monkey/commandqueue.ts:6](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L6)

---

### commands

• `Private` **commands**: [`BaseCommand`](Monkey.BaseCommand.md)<`unknown`\>[] = `[]`

#### Defined in

[src/monkey/commandqueue.ts:7](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L7)

---

### errors

• `Private` **errors**: `string`[] = `[]`

#### Defined in

[src/monkey/commandqueue.ts:9](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L9)

---

### replies

• `Private` **replies**: `unknown`[] = `[]`

#### Defined in

[src/monkey/commandqueue.ts:8](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L8)

---

### sent

• `Private` **sent**: `boolean` = `false`

#### Defined in

[src/monkey/commandqueue.ts:10](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L10)

## Accessors

### queue

• `Private` `get` **queue**(): [`BaseCommand`](Monkey.BaseCommand.md)<`unknown`\>[]

#### Returns

[`BaseCommand`](Monkey.BaseCommand.md)<`unknown`\>[]

#### Defined in

[src/monkey/commandqueue.ts:17](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L17)

• `Private` `set` **queue**(`queue`): `void`

#### Parameters

| Name    | Type                                                 |
| :------ | :--------------------------------------------------- |
| `queue` | [`BaseCommand`](Monkey.BaseCommand.md)<`unknown`\>[] |

#### Returns

`void`

#### Defined in

[src/monkey/commandqueue.ts:21](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L21)

## Methods

### collector

▸ `Private` **collector**(`err`, `value`, `command`): `void`

#### Parameters

| Name      | Type              |
| :-------- | :---------------- |
| `err`     | `null` \| `Error` |
| `value`   | `unknown`         |
| `command` | `string`          |

#### Returns

`void`

#### Defined in

[src/monkey/commandqueue.ts:25](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L25)

---

### done

▸ **done**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[done](Monkey.Api.md#done)

#### Defined in

[src/monkey/api.ts:122](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L122)

---

### execute

▸ **execute**(`cb`): `void`

#### Parameters

| Name | Type                                                      |
| :--- | :-------------------------------------------------------- |
| `cb` | (`err`: `null` \| `Error`, `data`: `unknown`[]) => `void` |

#### Returns

`void`

#### Defined in

[src/monkey/commandqueue.ts:97](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L97)

---

### flipClose

▸ **flipClose**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[flipClose](Monkey.Api.md#flipclose)

#### Defined in

[src/monkey/api.ts:79](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L79)

---

### flipOpen

▸ **flipOpen**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[flipOpen](Monkey.Api.md#flipopen)

#### Defined in

[src/monkey/api.ts:75](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L75)

---

### forbidReuse

▸ `Private` **forbidReuse**(): `void`

#### Returns

`void`

#### Defined in

[src/monkey/commandqueue.ts:51](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L51)

---

### get

▸ **get**(`name`, `cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name   | Type                                                                       |
| :----- | :------------------------------------------------------------------------- |
| `name` | `string`                                                                   |
| `cb?`  | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[get](Monkey.Api.md#get)

#### Defined in

[src/monkey/api.ts:110](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L110)

---

### getAmCurrentAction

▸ **getAmCurrentAction**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getAmCurrentAction](Monkey.Api.md#getamcurrentaction)

#### Defined in

[src/monkey/api.ts:129](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L129)

---

### getAmCurrentCategories

▸ **getAmCurrentCategories**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                         |
| :---- | :--------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`[]\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getAmCurrentCategories](Monkey.Api.md#getamcurrentcategories)

#### Defined in

[src/monkey/api.ts:133](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L133)

---

### getAmCurrentCompClass

▸ **getAmCurrentCompClass**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getAmCurrentCompClass](Monkey.Api.md#getamcurrentcompclass)

#### Defined in

[src/monkey/api.ts:141](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L141)

---

### getAmCurrentCompPackage

▸ **getAmCurrentCompPackage**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getAmCurrentCompPackage](Monkey.Api.md#getamcurrentcomppackage)

#### Defined in

[src/monkey/api.ts:145](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L145)

---

### getAmCurrentData

▸ **getAmCurrentData**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getAmCurrentData](Monkey.Api.md#getamcurrentdata)

#### Defined in

[src/monkey/api.ts:149](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L149)

---

### getAmCurrentPackage

▸ **getAmCurrentPackage**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getAmCurrentPackage](Monkey.Api.md#getamcurrentpackage)

#### Defined in

[src/monkey/api.ts:153](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L153)

---

### getBuildBoard

▸ **getBuildBoard**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildBoard](Monkey.Api.md#getbuildboard)

#### Defined in

[src/monkey/api.ts:157](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L157)

---

### getBuildBrand

▸ **getBuildBrand**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildBrand](Monkey.Api.md#getbuildbrand)

#### Defined in

[src/monkey/api.ts:161](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L161)

---

### getBuildCpuAbi

▸ **getBuildCpuAbi**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildCpuAbi](Monkey.Api.md#getbuildcpuabi)

#### Defined in

[src/monkey/api.ts:165](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L165)

---

### getBuildDevice

▸ **getBuildDevice**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildDevice](Monkey.Api.md#getbuilddevice)

#### Defined in

[src/monkey/api.ts:169](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L169)

---

### getBuildDisplay

▸ **getBuildDisplay**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildDisplay](Monkey.Api.md#getbuilddisplay)

#### Defined in

[src/monkey/api.ts:173](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L173)

---

### getBuildFingerprint

▸ **getBuildFingerprint**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildFingerprint](Monkey.Api.md#getbuildfingerprint)

#### Defined in

[src/monkey/api.ts:177](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L177)

---

### getBuildHost

▸ **getBuildHost**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildHost](Monkey.Api.md#getbuildhost)

#### Defined in

[src/monkey/api.ts:181](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L181)

---

### getBuildId

▸ **getBuildId**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildId](Monkey.Api.md#getbuildid)

#### Defined in

[src/monkey/api.ts:185](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L185)

---

### getBuildManufacturer

▸ **getBuildManufacturer**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildManufacturer](Monkey.Api.md#getbuildmanufacturer)

#### Defined in

[src/monkey/api.ts:189](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L189)

---

### getBuildModel

▸ **getBuildModel**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildModel](Monkey.Api.md#getbuildmodel)

#### Defined in

[src/monkey/api.ts:193](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L193)

---

### getBuildProduct

▸ **getBuildProduct**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildProduct](Monkey.Api.md#getbuildproduct)

#### Defined in

[src/monkey/api.ts:197](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L197)

---

### getBuildTags

▸ **getBuildTags**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                         |
| :---- | :--------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`[]\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildTags](Monkey.Api.md#getbuildtags)

#### Defined in

[src/monkey/api.ts:201](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L201)

---

### getBuildType

▸ **getBuildType**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildType](Monkey.Api.md#getbuildtype)

#### Defined in

[src/monkey/api.ts:209](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L209)

---

### getBuildUser

▸ **getBuildUser**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildUser](Monkey.Api.md#getbuilduser)

#### Defined in

[src/monkey/api.ts:213](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L213)

---

### getBuildVersionCodename

▸ **getBuildVersionCodename**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildVersionCodename](Monkey.Api.md#getbuildversioncodename)

#### Defined in

[src/monkey/api.ts:217](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L217)

---

### getBuildVersionIncremental

▸ **getBuildVersionIncremental**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildVersionIncremental](Monkey.Api.md#getbuildversionincremental)

#### Defined in

[src/monkey/api.ts:221](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L221)

---

### getBuildVersionRelease

▸ **getBuildVersionRelease**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildVersionRelease](Monkey.Api.md#getbuildversionrelease)

#### Defined in

[src/monkey/api.ts:227](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L227)

---

### getBuildVersionSdk

▸ **getBuildVersionSdk**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `number`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildVersionSdk](Monkey.Api.md#getbuildversionsdk)

#### Defined in

[src/monkey/api.ts:231](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L231)

---

### getClockMillis

▸ **getClockMillis**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `number`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getClockMillis](Monkey.Api.md#getclockmillis)

#### Defined in

[src/monkey/api.ts:235](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L235)

---

### getClockRealtime

▸ **getClockRealtime**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `number`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getClockRealtime](Monkey.Api.md#getclockrealtime)

#### Defined in

[src/monkey/api.ts:239](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L239)

---

### getClockUptime

▸ **getClockUptime**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `number`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getClockUptime](Monkey.Api.md#getclockuptime)

#### Defined in

[src/monkey/api.ts:243](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L243)

---

### getCommands

▸ `Private` **getCommands**(): `string`

#### Returns

`string`

#### Defined in

[src/monkey/commandqueue.ts:86](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L86)

---

### getDisplayDensity

▸ **getDisplayDensity**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `number`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getDisplayDensity](Monkey.Api.md#getdisplaydensity)

#### Defined in

[src/monkey/api.ts:247](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L247)

---

### getDisplayHeight

▸ **getDisplayHeight**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `number`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getDisplayHeight](Monkey.Api.md#getdisplayheight)

#### Defined in

[src/monkey/api.ts:251](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L251)

---

### getDisplayWidth

▸ **getDisplayWidth**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `number`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[getDisplayWidth](Monkey.Api.md#getdisplaywidth)

#### Defined in

[src/monkey/api.ts:255](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L255)

---

### keyDown

▸ **keyDown**(`keyCode`, `cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name      | Type                                                  |
| :-------- | :---------------------------------------------------- |
| `keyCode` | `number`                                              |
| `cb?`     | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[keyDown](Monkey.Api.md#keydown)

#### Defined in

[src/monkey/api.ts:51](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L51)

---

### keyUp

▸ **keyUp**(`keyCode`, `cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name      | Type                                                  |
| :-------- | :---------------------------------------------------- |
| `keyCode` | `number`                                              |
| `cb?`     | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[keyUp](Monkey.Api.md#keyup)

#### Defined in

[src/monkey/api.ts:55](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L55)

---

### list

▸ **list**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                                         |
| :---- | :--------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`[]\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[list](Monkey.Api.md#list)

#### Defined in

[src/monkey/api.ts:104](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L104)

---

### maybeFinish

▸ `Private` **maybeFinish**(): `void`

#### Returns

`void`

#### Defined in

[src/monkey/commandqueue.ts:37](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L37)

---

### press

▸ **press**(`keyCode`, `cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name      | Type                                                  |
| :-------- | :---------------------------------------------------- |
| `keyCode` | `number`                                              |
| `cb?`     | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[press](Monkey.Api.md#press)

#### Defined in

[src/monkey/api.ts:91](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L91)

---

### pushCommands

▸ `Private` **pushCommands**(): `void`

#### Returns

`void`

#### Defined in

[src/monkey/commandqueue.ts:93](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L93)

---

### quit

▸ **quit**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[quit](Monkey.Api.md#quit)

#### Defined in

[src/monkey/api.ts:118](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L118)

---

### send

▸ **send**(`command`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `command` | `string` |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Overrides

[Api](Monkey.Api.md).[send](Monkey.Api.md#send)

#### Defined in

[src/monkey/commandqueue.ts:77](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L77)

---

### sendAndParse

▸ **sendAndParse**<`T`\>(`command`, `_cb`, `parser`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name      | Type                                          |
| :-------- | :-------------------------------------------- |
| `command` | `string`                                      |
| `_cb`     | `never`                                       |
| `parser`  | (`data`: `null` \| `string`) => `null` \| `T` |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Overrides

[Api](Monkey.Api.md).[sendAndParse](Monkey.Api.md#sendandparse)

#### Defined in

[src/monkey/commandqueue.ts:63](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L63)

---

### sendInternal

▸ `Private` **sendInternal**(`cmdConstruct`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name           | Type                                               |
| :------------- | :------------------------------------------------- |
| `cmdConstruct` | [`BaseCommand`](Monkey.BaseCommand.md)<`unknown`\> |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Defined in

[src/monkey/commandqueue.ts:57](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/commandqueue.ts#L57)

---

### sleep

▸ **sleep**(`ms`, `cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `ms`  | `number`                                              |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[sleep](Monkey.Api.md#sleep)

#### Defined in

[src/monkey/api.ts:114](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L114)

---

### tap

▸ **tap**(`x`, `y`, `cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `x`   | `number`                                              |
| `y`   | `number`                                              |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[tap](Monkey.Api.md#tap)

#### Defined in

[src/monkey/api.ts:87](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L87)

---

### touchDown

▸ **touchDown**(`x`, `y`, `cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `x`   | `number`                                              |
| `y`   | `number`                                              |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[touchDown](Monkey.Api.md#touchdown)

#### Defined in

[src/monkey/api.ts:59](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L59)

---

### touchMove

▸ **touchMove**(`x`, `y`, `cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `x`   | `number`                                              |
| `y`   | `number`                                              |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[touchMove](Monkey.Api.md#touchmove)

#### Defined in

[src/monkey/api.ts:67](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L67)

---

### touchUp

▸ **touchUp**(`x`, `y`, `cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `x`   | `number`                                              |
| `y`   | `number`                                              |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[touchUp](Monkey.Api.md#touchup)

#### Defined in

[src/monkey/api.ts:63](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L63)

---

### trackball

▸ **trackball**(`dx`, `dy`, `cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `dx`  | `number`                                              |
| `dy`  | `number`                                              |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[trackball](Monkey.Api.md#trackball)

#### Defined in

[src/monkey/api.ts:71](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L71)

---

### type

▸ **type**(`str`, `cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `str` | `string`                                              |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[type](Monkey.Api.md#type)

#### Defined in

[src/monkey/api.ts:95](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L95)

---

### wake

▸ **wake**(`cb?`): [`CommandQueue`](Monkey.CommandQueue.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

#### Inherited from

[Api](Monkey.Api.md).[wake](Monkey.Api.md#wake)

#### Defined in

[src/monkey/api.ts:83](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L83)
