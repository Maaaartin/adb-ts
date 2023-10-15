[adb-ts](../README.md) / [Exports](../modules.md) / [Logcat](../modules/Logcat.md) / LogcatReader

# Class: LogcatReader

[Logcat](../modules/Logcat.md).LogcatReader

## Hierarchy

- `default`

  ↳ **`LogcatReader`**

## Table of contents

### Constructors

- [constructor](Logcat.LogcatReader.md#constructor)

### Properties

- [filter](Logcat.LogcatReader.md#filter)
- [parser](Logcat.LogcatReader.md#parser)
- [stream\_](Logcat.LogcatReader.md#stream_)

### Accessors

- [stream](Logcat.LogcatReader.md#stream)

### Methods

- [connect](Logcat.LogcatReader.md#connect)
- [end](Logcat.LogcatReader.md#end)
- [hook](Logcat.LogcatReader.md#hook)
- [on](Logcat.LogcatReader.md#on)

## Constructors

### constructor

• **new LogcatReader**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`LogcatReaderOptions`](../modules/Util.md#logcatreaderoptions) |

#### Overrides

StreamHandler.constructor

#### Defined in

[src/logcat/reader.ts:12](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/reader.ts#L12)

## Properties

### filter

• `Private` **filter**: `void` \| (`entry`: [`LogcatEntry`](Logcat.LogcatEntry.md)) => `boolean`

#### Defined in

[src/logcat/reader.ts:9](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/reader.ts#L9)

___

### parser

• `Private` **parser**: [`Binary`](Logcat.Binary.md)

#### Defined in

[src/logcat/reader.ts:10](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/reader.ts#L10)

___

### stream\_

• `Private` **stream\_**: ``null`` \| `Writable` = `null`

#### Defined in

[src/logcat/reader.ts:11](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/reader.ts#L11)

## Accessors

### stream

• `Private` `get` **stream**(): `Writable`

#### Returns

`Writable`

#### Defined in

[src/logcat/reader.ts:17](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/reader.ts#L17)

## Methods

### connect

▸ **connect**(`stream`): [`LogcatReader`](Logcat.LogcatReader.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | `Writable` |

#### Returns

[`LogcatReader`](Logcat.LogcatReader.md)

#### Defined in

[src/logcat/reader.ts:61](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/reader.ts#L61)

___

### end

▸ **end**(): `void`

#### Returns

`void`

#### Overrides

StreamHandler.end

#### Defined in

[src/logcat/reader.ts:67](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/reader.ts#L67)

___

### hook

▸ `Private` **hook**(): `void`

#### Returns

`void`

#### Defined in

[src/logcat/reader.ts:24](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/reader.ts#L24)

___

### on

▸ **on**(`event`, `listener`): [`LogcatReader`](Logcat.LogcatReader.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`LogcatReader`](Logcat.LogcatReader.md)

#### Overrides

StreamHandler.on

#### Defined in

[src/logcat/reader.ts:51](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/reader.ts#L51)

▸ **on**(`event`, `listener`): [`LogcatReader`](Logcat.LogcatReader.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"entry"`` |
| `listener` | (`entry`: [`LogcatEntry`](Logcat.LogcatEntry.md)) => `void` |

#### Returns

[`LogcatReader`](Logcat.LogcatReader.md)

#### Overrides

StreamHandler.on

#### Defined in

[src/logcat/reader.ts:52](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/reader.ts#L52)

▸ **on**(`event`, `listener`): [`LogcatReader`](Logcat.LogcatReader.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` \| ``"finish"`` |
| `listener` | () => `void` |

#### Returns

[`LogcatReader`](Logcat.LogcatReader.md)

#### Overrides

StreamHandler.on

#### Defined in

[src/logcat/reader.ts:53](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/reader.ts#L53)
