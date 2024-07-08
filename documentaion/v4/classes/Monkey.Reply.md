[adb-ts](../README.md) / [Exports](../modules.md) / [Monkey](../modules/Monkey.md) / Reply

# Class: Reply

[Monkey](../modules/Monkey.md).Reply

## Hierarchy

-   **`Reply`**

    ↳ [`OkReply`](Monkey.OkReply.md)

    ↳ [`ErrReply`](Monkey.ErrReply.md)

## Table of contents

### Constructors

-   [constructor](Monkey.Reply.md#constructor)

### Properties

-   [value](Monkey.Reply.md#value)

### Methods

-   [isError](Monkey.Reply.md#iserror)

## Constructors

### constructor

• **new Reply**()

## Properties

### value

• `Abstract` **value**: `null` \| `string`

#### Defined in

[src/monkey/reply.ts:2](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/reply.ts#L2)

## Methods

### isError

▸ `Abstract` **isError**(): this is ErrReply

#### Returns

this is ErrReply

#### Defined in

[src/monkey/reply.ts:3](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/reply.ts#L3)
