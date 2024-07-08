[adb-ts](../README.md) / [Exports](../modules.md) / [Commands](../modules/Commands.md) / TransportCommand

# Class: TransportCommand<T\>

[Commands](../modules/Commands.md).TransportCommand

## Type parameters

| Name |
| :--- |
| `T`  |

## Hierarchy

-   `default`<`T`\>

    ↳ **`TransportCommand`**

## Table of contents

### Constructors

-   [constructor](Commands.TransportCommand.md#constructor)

### Properties

-   [Cmd](Commands.TransportCommand.md#cmd)
-   [autoEnd](Commands.TransportCommand.md#autoend)
-   [connection](Commands.TransportCommand.md#connection)
-   [keepAlive](Commands.TransportCommand.md#keepalive)
-   [parser](Commands.TransportCommand.md#parser)
-   [serial](Commands.TransportCommand.md#serial)

### Methods

-   [endConnection](Commands.TransportCommand.md#endconnection)
-   [execute](Commands.TransportCommand.md#execute)
-   [initAndValidateReply](Commands.TransportCommand.md#initandvalidatereply)
-   [initExecute](Commands.TransportCommand.md#initexecute)
-   [postExecute](Commands.TransportCommand.md#postexecute)
-   [readAndValidateReply](Commands.TransportCommand.md#readandvalidatereply)
-   [validateReply](Commands.TransportCommand.md#validatereply)

## Constructors

### constructor

• **new TransportCommand**<`T`\>(`connection`, `serial`)

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name         | Type                                     |
| :----------- | :--------------------------------------- |
| `connection` | [`Connection`](Connection.Connection.md) |
| `serial`     | `string`                                 |

#### Overrides

Cmd&lt;T\&gt;.constructor

#### Defined in

[src/commands/abstract/transport.ts:9](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/abstract/transport.ts#L9)

## Properties

### Cmd

• `Protected` `Abstract` **Cmd**: `string`

#### Inherited from

Cmd.Cmd

#### Defined in

[src/commands/abstract/cmd.ts:4](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/abstract/cmd.ts#L4)

---

### autoEnd

• `Protected` **autoEnd**: `boolean` = `false`

#### Overrides

Cmd.autoEnd

#### Defined in

[src/commands/abstract/transport.ts:6](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/abstract/transport.ts#L6)

---

### connection

• `Readonly` **connection**: [`Connection`](Connection.Connection.md)

#### Inherited from

Cmd.connection

#### Defined in

[src/commands/command.ts:7](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/command.ts#L7)

---

### keepAlive

• `Protected` `Abstract` **keepAlive**: `boolean`

#### Defined in

[src/commands/abstract/transport.ts:7](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/abstract/transport.ts#L7)

---

### parser

• `Readonly` **parser**: [`Parser`](Parser.Parser.md)

#### Inherited from

Cmd.parser

#### Defined in

[src/commands/command.ts:8](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/command.ts#L8)

---

### serial

• `Private` **serial**: `string`

#### Defined in

[src/commands/abstract/transport.ts:5](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/abstract/transport.ts#L5)

## Methods

### endConnection

▸ **endConnection**(): `void`

#### Returns

`void`

#### Inherited from

Cmd.endConnection

#### Defined in

[src/commands/command.ts:34](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/command.ts#L34)

---

### execute

▸ **execute**(): `Promise`<`T`\>

Executes [Cmd](Commands.TransportCommand.md#cmd) on the device

#### Returns

`Promise`<`T`\>

#### Overrides

Cmd.execute

#### Defined in

[src/commands/abstract/transport.ts:21](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/abstract/transport.ts#L21)

---

### initAndValidateReply

▸ `Protected` **initAndValidateReply**(`args`): `Promise`<`void`\>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `args` | `string` |

#### Returns

`Promise`<`void`\>

#### Inherited from

Cmd.initAndValidateReply

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

#### Inherited from

Cmd.initExecute

#### Defined in

[src/commands/command.ts:46](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/command.ts#L46)

---

### postExecute

▸ `Protected` `Abstract` **postExecute**(): `T` \| `Promise`<`T`\>

Executed when [execute](Commands.TransportCommand.md#execute) was successful

#### Returns

`T` \| `Promise`<`T`\>

#### Defined in

[src/commands/abstract/transport.ts:17](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/abstract/transport.ts#L17)

---

### readAndValidateReply

▸ `Protected` **readAndValidateReply**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Inherited from

Cmd.readAndValidateReply

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

#### Inherited from

Cmd.validateReply

#### Defined in

[src/commands/command.ts:15](https://github.com/Maaaartin/adb-ts/blob/5393493/src/commands/command.ts#L15)
