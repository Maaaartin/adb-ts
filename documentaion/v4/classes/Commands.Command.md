[adb-ts](../README.md) / [Exports](../modules.md) / [Commands](../modules/Commands.md) / Command

# Class: Command<T\>

[Commands](../modules/Commands.md).Command

## Type parameters

| Name |
| :--- |
| `T`  |

## Table of contents

### Constructors

-   [constructor](Commands.Command.md#constructor)

### Properties

-   [autoEnd](Commands.Command.md#autoend)
-   [connection](Commands.Command.md#connection)
-   [parser](Commands.Command.md#parser)

### Methods

-   [endConnection](Commands.Command.md#endconnection)
-   [execute](Commands.Command.md#execute)
-   [initAndValidateReply](Commands.Command.md#initandvalidatereply)
-   [initExecute](Commands.Command.md#initexecute)
-   [readAndValidateReply](Commands.Command.md#readandvalidatereply)
-   [validateReply](Commands.Command.md#validatereply)

## Constructors

### constructor

• **new Command**<`T`\>(`connection`)

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name         | Type                                     |
| :----------- | :--------------------------------------- |
| `connection` | [`Connection`](Connection.Connection.md) |

#### Defined in

[src/commands/command.ts:10](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/command.ts#L10)

## Properties

### autoEnd

• `Protected` `Abstract` **autoEnd**: `boolean`

#### Defined in

[src/commands/command.ts:9](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/command.ts#L9)

---

### connection

• `Readonly` **connection**: [`Connection`](Connection.Connection.md)

#### Defined in

[src/commands/command.ts:7](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/command.ts#L7)

---

### parser

• `Readonly` **parser**: [`Parser`](Parser.Parser.md)

#### Defined in

[src/commands/command.ts:8](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/command.ts#L8)

## Methods

### endConnection

▸ **endConnection**(): `void`

#### Returns

`void`

#### Defined in

[src/commands/command.ts:34](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/command.ts#L34)

---

### execute

▸ `Abstract` **execute**(): `Promise`<`T`\>

#### Returns

`Promise`<`T`\>

#### Defined in

[src/commands/command.ts:55](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/command.ts#L55)

---

### initAndValidateReply

▸ `Protected` **initAndValidateReply**(`args`): `Promise`<`void`\>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `args` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/commands/command.ts:38](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/command.ts#L38)

---

### initExecute

▸ `Protected` **initExecute**(`args`): `Promise`<`string`\>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `args` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/commands/command.ts:46](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/command.ts#L46)

---

### readAndValidateReply

▸ `Protected` **readAndValidateReply**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/commands/command.ts:30](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/command.ts#L30)

---

### validateReply

▸ `Protected` **validateReply**(`reply`): `Promise`<`void`\>

#### Parameters

| Name    | Type                 |
| :------ | :------------------- |
| `reply` | `string` \| `Buffer` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/commands/command.ts:15](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/command.ts#L15)
