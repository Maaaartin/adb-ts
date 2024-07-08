[adb-ts](../README.md) / [Exports](../modules.md) / [Monkey](../modules/Monkey.md) / OkReply

# Class: OkReply

[Monkey](../modules/Monkey.md).OkReply

## Hierarchy

-   [`Reply`](Monkey.Reply.md)

    ↳ **`OkReply`**

## Table of contents

### Constructors

-   [constructor](Monkey.OkReply.md#constructor)

### Properties

-   [value](Monkey.OkReply.md#value)

### Methods

-   [isError](Monkey.OkReply.md#iserror)

## Constructors

### constructor

• **new OkReply**(`value`)

#### Parameters

| Name    | Type               |
| :------ | :----------------- |
| `value` | `null` \| `string` |

#### Overrides

[Reply](Monkey.Reply.md).[constructor](Monkey.Reply.md#constructor)

#### Defined in

[src/monkey/reply.ts:8](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/reply.ts#L8)

## Properties

### value

• **value**: `null` \| `string`

#### Overrides

[Reply](Monkey.Reply.md).[value](Monkey.Reply.md#value)

#### Defined in

[src/monkey/reply.ts:7](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/reply.ts#L7)

## Methods

### isError

▸ **isError**(): this is ErrReply

#### Returns

this is ErrReply

#### Overrides

[Reply](Monkey.Reply.md).[isError](Monkey.Reply.md#iserror)

#### Defined in

[src/monkey/reply.ts:13](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/reply.ts#L13)
