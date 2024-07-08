[adb-ts](../README.md) / [Exports](../modules.md) / [Sync](../modules/Sync.md) / PushTransfer

# Class: PushTransfer

[Sync](../modules/Sync.md).PushTransfer

## Hierarchy

-   `default`

    ↳ **`PushTransfer`**

## Table of contents

### Constructors

-   [constructor](Sync.PushTransfer.md#constructor)

### Properties

-   [stack](Sync.PushTransfer.md#stack)
-   [stats](Sync.PushTransfer.md#stats)

### Methods

-   [cancel](Sync.PushTransfer.md#cancel)
-   [end](Sync.PushTransfer.md#end)
-   [on](Sync.PushTransfer.md#on)
-   [pop](Sync.PushTransfer.md#pop)
-   [push](Sync.PushTransfer.md#push)

## Constructors

### constructor

• **new PushTransfer**(`options?`)

#### Parameters

| Name       | Type                  |
| :--------- | :-------------------- |
| `options?` | `EventEmitterOptions` |

#### Inherited from

StreamHandler.constructor

#### Defined in

node_modules/@types/node/events.d.ts:76

## Properties

### stack

• `Private` `Readonly` **stack**: `number`[] = `[]`

#### Defined in

[src/sync/pushtransfer.ts:5](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pushtransfer.ts#L5)

---

### stats

• `Private` `Readonly` **stats**: [`StatsObject`](../modules/Util.md#statsobject)

#### Defined in

[src/sync/pushtransfer.ts:6](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pushtransfer.ts#L6)

## Methods

### cancel

▸ **cancel**(): `boolean`

#### Returns

`boolean`

#### Defined in

[src/sync/pushtransfer.ts:10](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pushtransfer.ts#L10)

---

### end

▸ **end**(): `void`

#### Returns

`void`

#### Overrides

StreamHandler.end

#### Defined in

[src/sync/pushtransfer.ts:24](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pushtransfer.ts#L24)

---

### on

▸ **on**(`event`, `listener`): [`PushTransfer`](Sync.PushTransfer.md)

#### Parameters

| Name       | Type                       |
| :--------- | :------------------------- |
| `event`    | `"error"`                  |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`PushTransfer`](Sync.PushTransfer.md)

#### Overrides

StreamHandler.on

#### Defined in

[src/sync/pushtransfer.ts:28](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pushtransfer.ts#L28)

▸ **on**(`event`, `listener`): [`PushTransfer`](Sync.PushTransfer.md)

#### Parameters

| Name       | Type                  |
| :--------- | :-------------------- |
| `event`    | `"end"` \| `"cancel"` |
| `listener` | () => `void`          |

#### Returns

[`PushTransfer`](Sync.PushTransfer.md)

#### Overrides

StreamHandler.on

#### Defined in

[src/sync/pushtransfer.ts:29](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pushtransfer.ts#L29)

▸ **on**(`event`, `listener`): [`PushTransfer`](Sync.PushTransfer.md)

#### Parameters

| Name       | Type                                                                 |
| :--------- | :------------------------------------------------------------------- |
| `event`    | `"progress"`                                                         |
| `listener` | (`stats`: [`StatsObject`](../modules/Util.md#statsobject)) => `void` |

#### Returns

[`PushTransfer`](Sync.PushTransfer.md)

#### Overrides

StreamHandler.on

#### Defined in

[src/sync/pushtransfer.ts:30](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pushtransfer.ts#L30)

---

### pop

▸ **pop**(): `void`

#### Returns

`void`

#### Defined in

[src/sync/pushtransfer.ts:18](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pushtransfer.ts#L18)

---

### push

▸ **push**(`byteCount`): `void`

#### Parameters

| Name        | Type     |
| :---------- | :------- |
| `byteCount` | `number` |

#### Returns

`void`

#### Defined in

[src/sync/pushtransfer.ts:14](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/pushtransfer.ts#L14)
