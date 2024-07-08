[adb-ts](../README.md) / [Exports](../modules.md) / [Monkey](../modules/Monkey.md) / Parser

# Class: Parser

[Monkey](../modules/Monkey.md).Parser

## Hierarchy

-   `EventEmitter`

    ↳ **`Parser`**

## Table of contents

### Constructors

-   [constructor](Monkey.Parser.md#constructor)

### Properties

-   [buffer](Monkey.Parser.md#buffer)
-   [column](Monkey.Parser.md#column)

### Methods

-   [on](Monkey.Parser.md#on)
-   [parse](Monkey.Parser.md#parse)
-   [parseLine](Monkey.Parser.md#parseline)

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

## Properties

### buffer

• `Private` **buffer**: `Buffer`

#### Defined in

[src/monkey/parser.ts:6](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/parser.ts#L6)

---

### column

• `Private` **column**: `number` = `0`

#### Defined in

[src/monkey/parser.ts:5](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/parser.ts#L5)

## Methods

### on

▸ **on**(`event`, `listener`): [`Parser`](Monkey.Parser.md)

#### Parameters

| Name       | Type                                            |
| :--------- | :---------------------------------------------- |
| `event`    | `"reply"`                                       |
| `listener` | (`reply`: [`Reply`](Monkey.Reply.md)) => `void` |

#### Returns

[`Parser`](Monkey.Parser.md)

#### Overrides

EventEmitter.on

#### Defined in

[src/monkey/parser.ts:47](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/parser.ts#L47)

▸ **on**(`event`, `listener`): [`Parser`](Monkey.Parser.md)

#### Parameters

| Name       | Type                         |
| :--------- | :--------------------------- |
| `event`    | `"error"`                    |
| `listener` | (`error`: `Error`) => `void` |

#### Returns

[`Parser`](Monkey.Parser.md)

#### Overrides

EventEmitter.on

#### Defined in

[src/monkey/parser.ts:48](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/parser.ts#L48)

---

### parse

▸ **parse**(`chunk`): `void`

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `chunk` | `Buffer` |

#### Returns

`void`

#### Defined in

[src/monkey/parser.ts:8](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/parser.ts#L8)

---

### parseLine

▸ `Private` **parseLine**(`line`): `void`

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `line` | `Buffer` |

#### Returns

`void`

#### Defined in

[src/monkey/parser.ts:21](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/parser.ts#L21)
