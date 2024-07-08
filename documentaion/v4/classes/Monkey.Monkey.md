[adb-ts](../README.md) / [Exports](../modules.md) / [Monkey](../modules/Monkey.md) / Monkey

# Class: Monkey

[Monkey](../modules/Monkey.md).Monkey

## Hierarchy

-   [`Api`](Monkey.Api.md)

    ↳ **`Monkey`**

## Table of contents

### Constructors

-   [constructor](Monkey.Monkey.md#constructor)

### Properties

-   [parser](Monkey.Monkey.md#parser)
-   [queue](Monkey.Monkey.md#queue)
-   [stream\_](Monkey.Monkey.md#stream_)
-   [timeout](Monkey.Monkey.md#timeout)

### Accessors

-   [stream](Monkey.Monkey.md#stream)

### Methods

-   [commandQueue](Monkey.Monkey.md#commandqueue)
-   [connect](Monkey.Monkey.md#connect)
-   [consume](Monkey.Monkey.md#consume)
-   [done](Monkey.Monkey.md#done)
-   [end](Monkey.Monkey.md#end)
-   [flipClose](Monkey.Monkey.md#flipclose)
-   [flipOpen](Monkey.Monkey.md#flipopen)
-   [get](Monkey.Monkey.md#get)
-   [getAmCurrentAction](Monkey.Monkey.md#getamcurrentaction)
-   [getAmCurrentCategories](Monkey.Monkey.md#getamcurrentcategories)
-   [getAmCurrentCompClass](Monkey.Monkey.md#getamcurrentcompclass)
-   [getAmCurrentCompPackage](Monkey.Monkey.md#getamcurrentcomppackage)
-   [getAmCurrentData](Monkey.Monkey.md#getamcurrentdata)
-   [getAmCurrentPackage](Monkey.Monkey.md#getamcurrentpackage)
-   [getBuildBoard](Monkey.Monkey.md#getbuildboard)
-   [getBuildBrand](Monkey.Monkey.md#getbuildbrand)
-   [getBuildCpuAbi](Monkey.Monkey.md#getbuildcpuabi)
-   [getBuildDevice](Monkey.Monkey.md#getbuilddevice)
-   [getBuildDisplay](Monkey.Monkey.md#getbuilddisplay)
-   [getBuildFingerprint](Monkey.Monkey.md#getbuildfingerprint)
-   [getBuildHost](Monkey.Monkey.md#getbuildhost)
-   [getBuildId](Monkey.Monkey.md#getbuildid)
-   [getBuildManufacturer](Monkey.Monkey.md#getbuildmanufacturer)
-   [getBuildModel](Monkey.Monkey.md#getbuildmodel)
-   [getBuildProduct](Monkey.Monkey.md#getbuildproduct)
-   [getBuildTags](Monkey.Monkey.md#getbuildtags)
-   [getBuildType](Monkey.Monkey.md#getbuildtype)
-   [getBuildUser](Monkey.Monkey.md#getbuilduser)
-   [getBuildVersionCodename](Monkey.Monkey.md#getbuildversioncodename)
-   [getBuildVersionIncremental](Monkey.Monkey.md#getbuildversionincremental)
-   [getBuildVersionRelease](Monkey.Monkey.md#getbuildversionrelease)
-   [getBuildVersionSdk](Monkey.Monkey.md#getbuildversionsdk)
-   [getClockMillis](Monkey.Monkey.md#getclockmillis)
-   [getClockRealtime](Monkey.Monkey.md#getclockrealtime)
-   [getClockUptime](Monkey.Monkey.md#getclockuptime)
-   [getDisplayDensity](Monkey.Monkey.md#getdisplaydensity)
-   [getDisplayHeight](Monkey.Monkey.md#getdisplayheight)
-   [getDisplayWidth](Monkey.Monkey.md#getdisplaywidth)
-   [hook](Monkey.Monkey.md#hook)
-   [keyDown](Monkey.Monkey.md#keydown)
-   [keyUp](Monkey.Monkey.md#keyup)
-   [list](Monkey.Monkey.md#list)
-   [on](Monkey.Monkey.md#on)
-   [press](Monkey.Monkey.md#press)
-   [quit](Monkey.Monkey.md#quit)
-   [send](Monkey.Monkey.md#send)
-   [sendAndParse](Monkey.Monkey.md#sendandparse)
-   [sendInternal](Monkey.Monkey.md#sendinternal)
-   [sleep](Monkey.Monkey.md#sleep)
-   [tap](Monkey.Monkey.md#tap)
-   [touchDown](Monkey.Monkey.md#touchdown)
-   [touchMove](Monkey.Monkey.md#touchmove)
-   [touchUp](Monkey.Monkey.md#touchup)
-   [trackball](Monkey.Monkey.md#trackball)
-   [type](Monkey.Monkey.md#type)
-   [wake](Monkey.Monkey.md#wake)

## Constructors

### constructor

• **new Monkey**(`options?`)

#### Parameters

| Name       | Type                  |
| :--------- | :-------------------- |
| `options?` | `EventEmitterOptions` |

#### Inherited from

[Api](Monkey.Api.md).[constructor](Monkey.Api.md#constructor)

#### Defined in

node_modules/@types/node/events.d.ts:76

## Properties

### parser

• `Private` **parser**: [`Parser`](Monkey.Parser.md)

#### Defined in

[src/monkey/client.ts:12](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/client.ts#L12)

---

### queue

• **queue**: [`BaseCommand`](Monkey.BaseCommand.md)<`unknown`\>[] = `[]`

#### Defined in

[src/monkey/client.ts:11](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/client.ts#L11)

---

### stream\_

• `Private` **stream\_**: `null` \| `Socket` = `null`

#### Defined in

[src/monkey/client.ts:13](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/client.ts#L13)

---

### timeout

• `Private` **timeout**: `undefined` \| `Timeout` = `undefined`

#### Defined in

[src/monkey/client.ts:14](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/client.ts#L14)

## Accessors

### stream

• `get` **stream**(): `Socket`

#### Returns

`Socket`

#### Defined in

[src/monkey/client.ts:16](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/client.ts#L16)

## Methods

### commandQueue

▸ **commandQueue**(): [`CommandQueue`](Monkey.CommandQueue.md)

Allows executing commands in a queue.

#### Returns

[`CommandQueue`](Monkey.CommandQueue.md)

**`Example`**

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

#### Defined in

[src/monkey/client.ts:148](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/client.ts#L148)

---

### connect

▸ **connect**(`param`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `param` | `Socket` |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Defined in

[src/monkey/client.ts:124](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/client.ts#L124)

---

### consume

▸ `Private` **consume**(`reply`): `void`

#### Parameters

| Name    | Type                       |
| :------ | :------------------------- |
| `reply` | [`Reply`](Monkey.Reply.md) |

#### Returns

`void`

#### Defined in

[src/monkey/client.ts:100](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/client.ts#L100)

---

### done

▸ **done**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[done](Monkey.Api.md#done)

#### Defined in

[src/monkey/api.ts:122](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L122)

---

### end

▸ **end**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type         |
| :---- | :----------- |
| `cb?` | () => `void` |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Defined in

[src/monkey/client.ts:130](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/client.ts#L130)

---

### flipClose

▸ **flipClose**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[flipClose](Monkey.Api.md#flipclose)

#### Defined in

[src/monkey/api.ts:79](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L79)

---

### flipOpen

▸ **flipOpen**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[flipOpen](Monkey.Api.md#flipopen)

#### Defined in

[src/monkey/api.ts:75](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L75)

---

### get

▸ **get**(`name`, `cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name   | Type                                                                       |
| :----- | :------------------------------------------------------------------------- |
| `name` | `string`                                                                   |
| `cb?`  | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[get](Monkey.Api.md#get)

#### Defined in

[src/monkey/api.ts:110](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L110)

---

### getAmCurrentAction

▸ **getAmCurrentAction**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getAmCurrentAction](Monkey.Api.md#getamcurrentaction)

#### Defined in

[src/monkey/api.ts:129](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L129)

---

### getAmCurrentCategories

▸ **getAmCurrentCategories**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                         |
| :---- | :--------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`[]\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getAmCurrentCategories](Monkey.Api.md#getamcurrentcategories)

#### Defined in

[src/monkey/api.ts:133](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L133)

---

### getAmCurrentCompClass

▸ **getAmCurrentCompClass**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getAmCurrentCompClass](Monkey.Api.md#getamcurrentcompclass)

#### Defined in

[src/monkey/api.ts:141](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L141)

---

### getAmCurrentCompPackage

▸ **getAmCurrentCompPackage**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getAmCurrentCompPackage](Monkey.Api.md#getamcurrentcomppackage)

#### Defined in

[src/monkey/api.ts:145](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L145)

---

### getAmCurrentData

▸ **getAmCurrentData**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getAmCurrentData](Monkey.Api.md#getamcurrentdata)

#### Defined in

[src/monkey/api.ts:149](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L149)

---

### getAmCurrentPackage

▸ **getAmCurrentPackage**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getAmCurrentPackage](Monkey.Api.md#getamcurrentpackage)

#### Defined in

[src/monkey/api.ts:153](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L153)

---

### getBuildBoard

▸ **getBuildBoard**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildBoard](Monkey.Api.md#getbuildboard)

#### Defined in

[src/monkey/api.ts:157](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L157)

---

### getBuildBrand

▸ **getBuildBrand**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildBrand](Monkey.Api.md#getbuildbrand)

#### Defined in

[src/monkey/api.ts:161](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L161)

---

### getBuildCpuAbi

▸ **getBuildCpuAbi**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildCpuAbi](Monkey.Api.md#getbuildcpuabi)

#### Defined in

[src/monkey/api.ts:165](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L165)

---

### getBuildDevice

▸ **getBuildDevice**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildDevice](Monkey.Api.md#getbuilddevice)

#### Defined in

[src/monkey/api.ts:169](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L169)

---

### getBuildDisplay

▸ **getBuildDisplay**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildDisplay](Monkey.Api.md#getbuilddisplay)

#### Defined in

[src/monkey/api.ts:173](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L173)

---

### getBuildFingerprint

▸ **getBuildFingerprint**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildFingerprint](Monkey.Api.md#getbuildfingerprint)

#### Defined in

[src/monkey/api.ts:177](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L177)

---

### getBuildHost

▸ **getBuildHost**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildHost](Monkey.Api.md#getbuildhost)

#### Defined in

[src/monkey/api.ts:181](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L181)

---

### getBuildId

▸ **getBuildId**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildId](Monkey.Api.md#getbuildid)

#### Defined in

[src/monkey/api.ts:185](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L185)

---

### getBuildManufacturer

▸ **getBuildManufacturer**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildManufacturer](Monkey.Api.md#getbuildmanufacturer)

#### Defined in

[src/monkey/api.ts:189](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L189)

---

### getBuildModel

▸ **getBuildModel**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildModel](Monkey.Api.md#getbuildmodel)

#### Defined in

[src/monkey/api.ts:193](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L193)

---

### getBuildProduct

▸ **getBuildProduct**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildProduct](Monkey.Api.md#getbuildproduct)

#### Defined in

[src/monkey/api.ts:197](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L197)

---

### getBuildTags

▸ **getBuildTags**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                         |
| :---- | :--------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`[]\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildTags](Monkey.Api.md#getbuildtags)

#### Defined in

[src/monkey/api.ts:201](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L201)

---

### getBuildType

▸ **getBuildType**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildType](Monkey.Api.md#getbuildtype)

#### Defined in

[src/monkey/api.ts:209](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L209)

---

### getBuildUser

▸ **getBuildUser**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildUser](Monkey.Api.md#getbuilduser)

#### Defined in

[src/monkey/api.ts:213](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L213)

---

### getBuildVersionCodename

▸ **getBuildVersionCodename**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildVersionCodename](Monkey.Api.md#getbuildversioncodename)

#### Defined in

[src/monkey/api.ts:217](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L217)

---

### getBuildVersionIncremental

▸ **getBuildVersionIncremental**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildVersionIncremental](Monkey.Api.md#getbuildversionincremental)

#### Defined in

[src/monkey/api.ts:221](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L221)

---

### getBuildVersionRelease

▸ **getBuildVersionRelease**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildVersionRelease](Monkey.Api.md#getbuildversionrelease)

#### Defined in

[src/monkey/api.ts:227](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L227)

---

### getBuildVersionSdk

▸ **getBuildVersionSdk**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `number`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getBuildVersionSdk](Monkey.Api.md#getbuildversionsdk)

#### Defined in

[src/monkey/api.ts:231](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L231)

---

### getClockMillis

▸ **getClockMillis**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `number`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getClockMillis](Monkey.Api.md#getclockmillis)

#### Defined in

[src/monkey/api.ts:235](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L235)

---

### getClockRealtime

▸ **getClockRealtime**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `number`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getClockRealtime](Monkey.Api.md#getclockrealtime)

#### Defined in

[src/monkey/api.ts:239](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L239)

---

### getClockUptime

▸ **getClockUptime**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `number`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getClockUptime](Monkey.Api.md#getclockuptime)

#### Defined in

[src/monkey/api.ts:243](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L243)

---

### getDisplayDensity

▸ **getDisplayDensity**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `number`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getDisplayDensity](Monkey.Api.md#getdisplaydensity)

#### Defined in

[src/monkey/api.ts:247](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L247)

---

### getDisplayHeight

▸ **getDisplayHeight**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `number`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getDisplayHeight](Monkey.Api.md#getdisplayheight)

#### Defined in

[src/monkey/api.ts:251](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L251)

---

### getDisplayWidth

▸ **getDisplayWidth**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                       |
| :---- | :------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `number`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[getDisplayWidth](Monkey.Api.md#getdisplaywidth)

#### Defined in

[src/monkey/api.ts:255](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L255)

---

### hook

▸ `Protected` **hook**(): `void`

#### Returns

`void`

#### Defined in

[src/monkey/client.ts:66](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/client.ts#L66)

---

### keyDown

▸ **keyDown**(`keyCode`, `cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name      | Type                                                  |
| :-------- | :---------------------------------------------------- |
| `keyCode` | `number`                                              |
| `cb?`     | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[keyDown](Monkey.Api.md#keydown)

#### Defined in

[src/monkey/api.ts:51](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L51)

---

### keyUp

▸ **keyUp**(`keyCode`, `cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name      | Type                                                  |
| :-------- | :---------------------------------------------------- |
| `keyCode` | `number`                                              |
| `cb?`     | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[keyUp](Monkey.Api.md#keyup)

#### Defined in

[src/monkey/api.ts:55](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L55)

---

### list

▸ **list**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                                         |
| :---- | :--------------------------------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`null` \| `string`[]\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[list](Monkey.Api.md#list)

#### Defined in

[src/monkey/api.ts:104](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L104)

---

### on

▸ **on**(`event`, `listener`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"error"`                  |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Overrides

Api.on

#### Defined in

[src/monkey/client.ts:91](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/client.ts#L91)

▸ **on**(`event`, `listener`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name       | Type                               |
| :--------- | :--------------------------------- |
| `event`    | `"end"` \| `"finish"` \| `"close"` |
| `listener` | () => `void`                       |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Overrides

Api.on

#### Defined in

[src/monkey/client.ts:92](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/client.ts#L92)

---

### press

▸ **press**(`keyCode`, `cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name      | Type                                                  |
| :-------- | :---------------------------------------------------- |
| `keyCode` | `number`                                              |
| `cb?`     | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[press](Monkey.Api.md#press)

#### Defined in

[src/monkey/api.ts:91](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L91)

---

### quit

▸ **quit**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[quit](Monkey.Api.md#quit)

#### Defined in

[src/monkey/api.ts:118](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L118)

---

### send

▸ **send**(`commands`, `cb`): [`Monkey`](Monkey.Monkey.md)

Writes commands to monkey stream.

#### Parameters

| Name       | Type                                                              |
| :--------- | :---------------------------------------------------------------- |
| `commands` | `string` \| `string`[]                                            |
| `cb`       | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`unknown`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

**`Example`**

```ts
monkey.send('key event 24', (err, value, command) => {});
```

#### Overrides

[Api](Monkey.Api.md).[send](Monkey.Api.md#send)

#### Defined in

[src/monkey/client.ts:56](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/client.ts#L56)

---

### sendAndParse

▸ **sendAndParse**<`T`\>(`commands`, `cb`, `parser`): [`Monkey`](Monkey.Monkey.md)

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name       | Type                                                        |
| :--------- | :---------------------------------------------------------- |
| `commands` | `string` \| `string`[]                                      |
| `cb`       | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`T`\> |
| `parser`   | (`data`: `null` \| `string`) => `T`                         |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Overrides

[Api](Monkey.Api.md).[sendAndParse](Monkey.Api.md#sendandparse)

#### Defined in

[src/monkey/client.ts:39](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/client.ts#L39)

---

### sendInternal

▸ `Private` **sendInternal**(`commands`, `cmdConstruct`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name           | Type                                                                    |
| :------------- | :---------------------------------------------------------------------- |
| `commands`     | `string` \| `string`[]                                                  |
| `cmdConstruct` | (`cmd`: `string`) => [`BaseCommand`](Monkey.BaseCommand.md)<`unknown`\> |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Defined in

[src/monkey/client.ts:23](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/client.ts#L23)

---

### sleep

▸ **sleep**(`ms`, `cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `ms`  | `number`                                              |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[sleep](Monkey.Api.md#sleep)

#### Defined in

[src/monkey/api.ts:114](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L114)

---

### tap

▸ **tap**(`x`, `y`, `cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `x`   | `number`                                              |
| `y`   | `number`                                              |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[tap](Monkey.Api.md#tap)

#### Defined in

[src/monkey/api.ts:87](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L87)

---

### touchDown

▸ **touchDown**(`x`, `y`, `cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `x`   | `number`                                              |
| `y`   | `number`                                              |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[touchDown](Monkey.Api.md#touchdown)

#### Defined in

[src/monkey/api.ts:59](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L59)

---

### touchMove

▸ **touchMove**(`x`, `y`, `cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `x`   | `number`                                              |
| `y`   | `number`                                              |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[touchMove](Monkey.Api.md#touchmove)

#### Defined in

[src/monkey/api.ts:67](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L67)

---

### touchUp

▸ **touchUp**(`x`, `y`, `cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `x`   | `number`                                              |
| `y`   | `number`                                              |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[touchUp](Monkey.Api.md#touchup)

#### Defined in

[src/monkey/api.ts:63](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L63)

---

### trackball

▸ **trackball**(`dx`, `dy`, `cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `dx`  | `number`                                              |
| `dy`  | `number`                                              |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[trackball](Monkey.Api.md#trackball)

#### Defined in

[src/monkey/api.ts:71](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L71)

---

### type

▸ **type**(`str`, `cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `str` | `string`                                              |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[type](Monkey.Api.md#type)

#### Defined in

[src/monkey/api.ts:95](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L95)

---

### wake

▸ **wake**(`cb?`): [`Monkey`](Monkey.Monkey.md)

#### Parameters

| Name  | Type                                                  |
| :---- | :---------------------------------------------------- |
| `cb?` | [`MonkeyCallback`](../modules/Util.md#monkeycallback) |

#### Returns

[`Monkey`](Monkey.Monkey.md)

#### Inherited from

[Api](Monkey.Api.md).[wake](Monkey.Api.md#wake)

#### Defined in

[src/monkey/api.ts:83](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/api.ts#L83)
