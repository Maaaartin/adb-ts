[adb-ts](../README.md) / [Exports](../modules.md) / [Logcat](../modules/Logcat.md) / Parser

# Class: Parser

[Logcat](../modules/Logcat.md).Parser

## Hierarchy

-   `EventEmitter`

    ↳ **`Parser`**

    ↳↳ [`Binary`](Logcat.Binary.md)

## Table of contents

### Constructors

-   [constructor](Logcat.Parser.md#constructor)

### Methods

-   [parse](Logcat.Parser.md#parse)

## Constructors

### constructor

• **new Parser**(`options?`)

#### Parameters

| Name       | Type                  |
| :--------- | :-------------------- |
| `options?` | `EventEmitterOptions` |

#### Inherited from

EventEmitter.constructor

#### Defined in

node_modules/@types/node/events.d.ts:76

## Methods

### parse

▸ `Abstract` **parse**(`...data`): `void`

#### Parameters

| Name      | Type        |
| :-------- | :---------- |
| `...data` | `unknown`[] |

#### Returns

`void`

#### Defined in

[src/logcat/parser.ts:4](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/parser.ts#L4)
