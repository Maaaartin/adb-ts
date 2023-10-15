[adb-ts](../README.md) / [Exports](../modules.md) / [Sync](../modules/Sync.md) / Sync

# Class: Sync

[Sync](../modules/Sync.md).Sync

## Hierarchy

- `EventEmitter`

  ↳ **`Sync`**

## Table of contents

### Constructors

- [constructor](Sync.Sync.md#constructor)

### Properties

- [connection](Sync.Sync.md#connection)
- [parser](Sync.Sync.md#parser)

### Methods

- [end](Sync.Sync.md#end)
- [error](Sync.Sync.md#error)
- [getDrainAwaiter](Sync.Sync.md#getdrainawaiter)
- [pull](Sync.Sync.md#pull)
- [push](Sync.Sync.md#push)
- [pushFile](Sync.Sync.md#pushfile)
- [pushStream](Sync.Sync.md#pushstream)
- [readData](Sync.Sync.md#readdata)
- [readDir](Sync.Sync.md#readdir)
- [sendCommandWithArg](Sync.Sync.md#sendcommandwitharg)
- [sendCommandWithLength](Sync.Sync.md#sendcommandwithlength)
- [writeData](Sync.Sync.md#writedata)
- [temp](Sync.Sync.md#temp)

## Constructors

### constructor

• **new Sync**(`connection`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `connection` | [`Connection`](Connection.Connection.md) |

#### Overrides

EventEmitter.constructor

#### Defined in

[src/sync/sync.ts:24](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/sync.ts#L24)

## Properties

### connection

• `Private` `Readonly` **connection**: [`Connection`](Connection.Connection.md)

#### Defined in

[src/sync/sync.ts:21](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/sync.ts#L21)

___

### parser

• `Private` `Readonly` **parser**: [`Parser`](Parser.Parser.md)

#### Defined in

[src/sync/sync.ts:22](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/sync.ts#L22)

## Methods

### end

▸ **end**(): `void`

#### Returns

`void`

#### Defined in

[src/sync/sync.ts:273](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/sync.ts#L273)

___

### error

▸ `Private` **error**(): `Promise`<`never`\>

#### Returns

`Promise`<`never`\>

#### Defined in

[src/sync/sync.ts:34](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/sync.ts#L34)

___

### getDrainAwaiter

▸ `Private` **getDrainAwaiter**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `unregisterDrainListener` | () => `void` |
| `waitForDrain` | (`cb`: (`err`: ``null``) => `void`) => `void` |

#### Defined in

[src/sync/sync.ts:47](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/sync.ts#L47)

___

### pull

▸ **pull**(`path`): [`PullTransfer`](Sync.PullTransfer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

[`PullTransfer`](Sync.PullTransfer.md)

#### Defined in

[src/sync/sync.ts:232](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/sync.ts#L232)

___

### push

▸ **push**(`contents`, `path`, `mode?`): [`PushTransfer`](Sync.PushTransfer.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `contents` | `string` \| `Readable` | `undefined` |
| `path` | `string` | `undefined` |
| `mode` | ``null`` \| [`SyncMode`](../enums/Sync.SyncMode.md) | `null` |

#### Returns

[`PushTransfer`](Sync.PushTransfer.md)

#### Defined in

[src/sync/sync.ts:180](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/sync.ts#L180)

___

### pushFile

▸ `Private` **pushFile**(`file`, `path`, `mode?`): [`PushTransfer`](Sync.PushTransfer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `file` | `string` |
| `path` | `string` |
| `mode?` | ``null`` \| [`SyncMode`](../enums/Sync.SyncMode.md) |

#### Returns

[`PushTransfer`](Sync.PushTransfer.md)

#### Defined in

[src/sync/sync.ts:168](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/sync.ts#L168)

___

### pushStream

▸ `Private` **pushStream**(`stream`, `path`, `mode?`): [`PushTransfer`](Sync.PushTransfer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | `Readable` |
| `path` | `string` |
| `mode?` | ``null`` \| [`SyncMode`](../enums/Sync.SyncMode.md) |

#### Returns

[`PushTransfer`](Sync.PushTransfer.md)

#### Defined in

[src/sync/sync.ts:155](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/sync.ts#L155)

___

### readData

▸ `Private` **readData**(): [`PullTransfer`](Sync.PullTransfer.md)

#### Returns

[`PullTransfer`](Sync.PullTransfer.md)

#### Defined in

[src/sync/sync.ts:191](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/sync.ts#L191)

___

### readDir

▸ **readDir**(`path`): `Promise`<[`SyncEntry`](Sync.SyncEntry.md)[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`<[`SyncEntry`](Sync.SyncEntry.md)[]\>

#### Defined in

[src/sync/sync.ts:237](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/sync.ts#L237)

___

### sendCommandWithArg

▸ `Private` **sendCommandWithArg**(`cmd`, `arg`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cmd` | `string` |
| `arg` | `string` |

#### Returns

`boolean`

#### Defined in

[src/sync/sync.ts:277](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/sync.ts#L277)

___

### sendCommandWithLength

▸ `Private` **sendCommandWithLength**(`cmd`, `length`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cmd` | [`Reply`](../enums/Util.Reply.md) |
| `length` | `number` |

#### Returns

`boolean`

#### Defined in

[src/sync/sync.ts:40](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/sync.ts#L40)

___

### writeData

▸ `Private` **writeData**(`stream`, `timestamp`): [`PushTransfer`](Sync.PushTransfer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | `Readable` |
| `timestamp` | `number` |

#### Returns

[`PushTransfer`](Sync.PushTransfer.md)

#### Defined in

[src/sync/sync.ts:66](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/sync.ts#L66)

___

### temp

▸ `Static` **temp**(`path`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`string`

#### Defined in

[src/sync/sync.ts:30](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/sync.ts#L30)
