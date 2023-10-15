[adb-ts](../README.md) / [Exports](../modules.md) / [Monkey](../modules/Monkey.md) / ErrReply

# Class: ErrReply

[Monkey](../modules/Monkey.md).ErrReply

## Hierarchy

- [`Reply`](Monkey.Reply.md)

  ↳ **`ErrReply`**

## Table of contents

### Constructors

- [constructor](Monkey.ErrReply.md#constructor)

### Properties

- [value](Monkey.ErrReply.md#value)

### Methods

- [isError](Monkey.ErrReply.md#iserror)
- [toError](Monkey.ErrReply.md#toerror)

## Constructors

### constructor

• **new ErrReply**(`value`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | ``null`` \| `string` |

#### Overrides

[Reply](Monkey.Reply.md).[constructor](Monkey.Reply.md#constructor)

#### Defined in

[src/monkey/reply.ts:20](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/reply.ts#L20)

## Properties

### value

• **value**: ``null`` \| `string`

#### Overrides

[Reply](Monkey.Reply.md).[value](Monkey.Reply.md#value)

#### Defined in

[src/monkey/reply.ts:19](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/reply.ts#L19)

## Methods

### isError

▸ **isError**(): this is ErrReply

#### Returns

this is ErrReply

#### Overrides

[Reply](Monkey.Reply.md).[isError](Monkey.Reply.md#iserror)

#### Defined in

[src/monkey/reply.ts:25](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/reply.ts#L25)

___

### toError

▸ **toError**(): `Error`

#### Returns

`Error`

#### Defined in

[src/monkey/reply.ts:29](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/reply.ts#L29)
