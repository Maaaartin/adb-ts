[adb-ts](../README.md) / [Exports](../modules.md) / [Sync](../modules/Sync.md) / PullTransfer

# Class: PullTransfer

[Sync](../modules/Sync.md).PullTransfer

## Hierarchy

-   `PassThrough`

    ↳ **`PullTransfer`**

## Table of contents

### Constructors

-   [constructor](Sync.PullTransfer.md#constructor)

### Properties

-   [stats](Sync.PullTransfer.md#stats)

### Methods

-   [cancel](Sync.PullTransfer.md#cancel)
-   [on](Sync.PullTransfer.md#on)
-   [write](Sync.PullTransfer.md#write)

## Constructors

### constructor

• **new PullTransfer**(`opts?`)

#### Parameters

| Name    | Type               |
| :------ | :----------------- |
| `opts?` | `TransformOptions` |

#### Inherited from

PassThrough.constructor

#### Defined in

node_modules/@types/node/stream.d.ts:1049

## Properties

### stats

• `Private` `Readonly` **stats**: [`StatsObject`](../modules/Util.md#statsobject)

#### Defined in

[src/sync/pulltransfer.ts:5](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pulltransfer.ts#L5)

## Methods

### cancel

▸ **cancel**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/sync/pulltransfer.ts:9](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pulltransfer.ts#L9)

---

### on

▸ **on**(`event`, `listener`): [`PullTransfer`](Sync.PullTransfer.md)

#### Parameters

| Name       | Type         |
| :--------- | :----------- |
| `event`    | `"close"`    |
| `listener` | () => `void` |

#### Returns

[`PullTransfer`](Sync.PullTransfer.md)

#### Overrides

PassThrough.on

#### Defined in

[src/sync/pulltransfer.ts:36](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pulltransfer.ts#L36)

▸ **on**(`event`, `listener`): [`PullTransfer`](Sync.PullTransfer.md)

#### Parameters

| Name       | Type                           |
| :--------- | :----------------------------- |
| `event`    | `"data"`                       |
| `listener` | (`chunk`: `unknown`) => `void` |

#### Returns

[`PullTransfer`](Sync.PullTransfer.md)

#### Overrides

PassThrough.on

#### Defined in

[src/sync/pulltransfer.ts:37](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pulltransfer.ts#L37)

▸ **on**(`event`, `listener`): [`PullTransfer`](Sync.PullTransfer.md)

#### Parameters

| Name       | Type         |
| :--------- | :----------- |
| `event`    | `"end"`      |
| `listener` | () => `void` |

#### Returns

[`PullTransfer`](Sync.PullTransfer.md)

#### Overrides

PassThrough.on

#### Defined in

[src/sync/pulltransfer.ts:38](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pulltransfer.ts#L38)

▸ **on**(`event`, `listener`): [`PullTransfer`](Sync.PullTransfer.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"error"`                  |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`PullTransfer`](Sync.PullTransfer.md)

#### Overrides

PassThrough.on

#### Defined in

[src/sync/pulltransfer.ts:39](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pulltransfer.ts#L39)

▸ **on**(`event`, `listener`): [`PullTransfer`](Sync.PullTransfer.md)

#### Parameters

| Name       | Type         |
| :--------- | :----------- |
| `event`    | `"pause"`    |
| `listener` | () => `void` |

#### Returns

[`PullTransfer`](Sync.PullTransfer.md)

#### Overrides

PassThrough.on

#### Defined in

[src/sync/pulltransfer.ts:40](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pulltransfer.ts#L40)

▸ **on**(`event`, `listener`): [`PullTransfer`](Sync.PullTransfer.md)

#### Parameters

| Name       | Type         |
| :--------- | :----------- |
| `event`    | `"readable"` |
| `listener` | () => `void` |

#### Returns

[`PullTransfer`](Sync.PullTransfer.md)

#### Overrides

PassThrough.on

#### Defined in

[src/sync/pulltransfer.ts:41](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pulltransfer.ts#L41)

▸ **on**(`event`, `listener`): [`PullTransfer`](Sync.PullTransfer.md)

#### Parameters

| Name       | Type         |
| :--------- | :----------- |
| `event`    | `"resume"`   |
| `listener` | () => `void` |

#### Returns

[`PullTransfer`](Sync.PullTransfer.md)

#### Overrides

PassThrough.on

#### Defined in

[src/sync/pulltransfer.ts:42](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pulltransfer.ts#L42)

▸ **on**(`event`, `listener`): [`PullTransfer`](Sync.PullTransfer.md)

#### Parameters

| Name       | Type                                                                 |
| :--------- | :------------------------------------------------------------------- |
| `event`    | `"progress"`                                                         |
| `listener` | (`stats`: [`StatsObject`](../modules/Util.md#statsobject)) => `void` |

#### Returns

[`PullTransfer`](Sync.PullTransfer.md)

#### Overrides

PassThrough.on

#### Defined in

[src/sync/pulltransfer.ts:43](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pulltransfer.ts#L43)

▸ **on**<`T`\>(`event`, `listener`): [`PullTransfer`](Sync.PullTransfer.md)

#### Type parameters

| Name | Type                |
| :--- | :------------------ |
| `T`  | extends `unknown`[] |

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `string` \| `symbol`       |
| `listener` | (...`args`: `T`) => `void` |

#### Returns

[`PullTransfer`](Sync.PullTransfer.md)

#### Overrides

PassThrough.on

#### Defined in

[src/sync/pulltransfer.ts:44](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pulltransfer.ts#L44)

---

### write

▸ **write**(`chunk`, `encoding?`, `cb?`): `boolean`

#### Parameters

| Name        | Type                                                  |
| :---------- | :---------------------------------------------------- |
| `chunk`     | `Buffer`                                              |
| `encoding?` | `BufferEncoding`                                      |
| `cb?`       | (`error`: `undefined` \| `null` \| `Error`) => `void` |

#### Returns

`boolean`

#### Overrides

PassThrough.write

#### Defined in

[src/sync/pulltransfer.ts:13](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pulltransfer.ts#L13)

▸ **write**(`chunk`, `cb?`): `boolean`

#### Parameters

| Name    | Type                                                  |
| :------ | :---------------------------------------------------- |
| `chunk` | `Buffer`                                              |
| `cb?`   | (`error`: `undefined` \| `null` \| `Error`) => `void` |

#### Returns

`boolean`

#### Overrides

PassThrough.write

#### Defined in

[src/sync/pulltransfer.ts:18](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pulltransfer.ts#L18)
