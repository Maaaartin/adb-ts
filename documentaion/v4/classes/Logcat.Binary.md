[adb-ts](../README.md) / [Exports](../modules.md) / [Logcat](../modules/Logcat.md) / Binary

# Class: Binary

[Logcat](../modules/Logcat.md).Binary

## Hierarchy

-   [`Parser`](Logcat.Parser.md)

    ↳ **`Binary`**

## Table of contents

### Constructors

-   [constructor](Logcat.Binary.md#constructor)

### Properties

-   [HEADER_SIZE_MAX](Logcat.Binary.md#header_size_max)
-   [HEADER_SIZE_V1](Logcat.Binary.md#header_size_v1)
-   [buffer](Logcat.Binary.md#buffer)

### Methods

-   [on](Logcat.Binary.md#on)
-   [parse](Logcat.Binary.md#parse)
-   [processEntry](Logcat.Binary.md#processentry)

## Constructors

### constructor

• **new Binary**(`options?`)

#### Parameters

| Name       | Type                  |
| :--------- | :-------------------- |
| `options?` | `EventEmitterOptions` |

#### Inherited from

[Parser](Logcat.Parser.md).[constructor](Logcat.Parser.md#constructor)

#### Defined in

node_modules/@types/node/events.d.ts:76

## Properties

### HEADER_SIZE_MAX

• `Private` `Readonly` **HEADER_SIZE_MAX**: `100`

#### Defined in

[src/logcat/parser/binary.ts:7](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/parser/binary.ts#L7)

---

### HEADER_SIZE_V1

• `Private` `Readonly` **HEADER_SIZE_V1**: `20`

#### Defined in

[src/logcat/parser/binary.ts:6](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/parser/binary.ts#L6)

---

### buffer

• `Private` **buffer**: `Buffer`

#### Defined in

[src/logcat/parser/binary.ts:5](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/parser/binary.ts#L5)

## Methods

### on

▸ **on**(`event`, `listener`): [`Binary`](Logcat.Binary.md)

#### Parameters

| Name       | Type                                                        |
| :--------- | :---------------------------------------------------------- |
| `event`    | `"entry"`                                                   |
| `listener` | (`entry`: [`LogcatEntry`](Logcat.LogcatEntry.md)) => `void` |

#### Returns

[`Binary`](Logcat.Binary.md)

#### Overrides

Parser.on

#### Defined in

[src/logcat/parser/binary.ts:70](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/parser/binary.ts#L70)

▸ **on**(`event`, `listener`): [`Binary`](Logcat.Binary.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"error"`                  |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Binary`](Logcat.Binary.md)

#### Overrides

Parser.on

#### Defined in

[src/logcat/parser/binary.ts:71](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/parser/binary.ts#L71)

▸ **on**(`event`, `listener`): [`Binary`](Logcat.Binary.md)

#### Parameters

| Name       | Type                  |
| :--------- | :-------------------- |
| `event`    | `"drain"` \| `"wait"` |
| `listener` | () => `void`          |

#### Returns

[`Binary`](Logcat.Binary.md)

#### Overrides

Parser.on

#### Defined in

[src/logcat/parser/binary.ts:72](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/parser/binary.ts#L72)

---

### parse

▸ **parse**(`chunk`): `void`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `chunk` | `Buffer` |

#### Returns

`void`

#### Overrides

[Parser](Logcat.Parser.md).[parse](Logcat.Parser.md#parse)

#### Defined in

[src/logcat/parser/binary.ts:9](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/parser/binary.ts#L9)

---

### processEntry

▸ `Private` **processEntry**(`entry`, `data`): `void`

#### Parameters

| Name    | Type                                   |
| :------ | :------------------------------------- |
| `entry` | [`LogcatEntry`](Logcat.LogcatEntry.md) |
| `data`  | `Buffer`                               |

#### Returns

`void`

#### Defined in

[src/logcat/parser/binary.ts:49](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/parser/binary.ts#L49)
