[adb-ts](../README.md) / [Exports](../modules.md) / [Tracker](../modules/Tracker.md) / Tracker

# Class: Tracker

[Tracker](../modules/Tracker.md).Tracker

## Hierarchy

- `EventEmitter`

  ↳ **`Tracker`**

## Table of contents

### Properties

- [client](Tracker.Tracker.md#client)
- [deviceMap](Tracker.Tracker.md#devicemap)
- [ended](Tracker.Tracker.md#ended)

### Methods

- [end](Tracker.Tracker.md#end)
- [hook](Tracker.Tracker.md#hook)
- [on](Tracker.Tracker.md#on)
- [read](Tracker.Tracker.md#read)
- [update](Tracker.Tracker.md#update)

## Properties

### client

• `Private` `Readonly` **client**: [`Client`](Client.Client.md)

#### Defined in

[src/tracker.ts:14](https://github.com/Maaaartin/adb-ts/blob/5393493/src/tracker.ts#L14)

___

### deviceMap

• `Private` **deviceMap**: ``null`` \| `Map`<`string`, [`IDevice`](../interfaces/Util.IDevice.md)\> = `null`

#### Defined in

[src/tracker.ts:13](https://github.com/Maaaartin/adb-ts/blob/5393493/src/tracker.ts#L13)

___

### ended

• `Private` **ended**: `boolean` = `false`

#### Defined in

[src/tracker.ts:11](https://github.com/Maaaartin/adb-ts/blob/5393493/src/tracker.ts#L11)

## Methods

### end

▸ **end**(): `void`

#### Returns

`void`

#### Defined in

[src/tracker.ts:84](https://github.com/Maaaartin/adb-ts/blob/5393493/src/tracker.ts#L84)

___

### hook

▸ `Private` **hook**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/tracker.ts:23](https://github.com/Maaaartin/adb-ts/blob/5393493/src/tracker.ts#L23)

___

### on

▸ **on**(`event`, `listener`): [`Tracker`](Tracker.Tracker.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"add"`` \| ``"change"`` |
| `listener` | (`device`: [`Device`](Device.Device.md)) => `void` |

#### Returns

[`Tracker`](Tracker.Tracker.md)

#### Overrides

EventEmitter.on

#### Defined in

[src/tracker.ts:89](https://github.com/Maaaartin/adb-ts/blob/5393493/src/tracker.ts#L89)

▸ **on**(`event`, `listener`): [`Tracker`](Tracker.Tracker.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"remove"`` |
| `listener` | (`device`: [`IDevice`](../interfaces/Util.IDevice.md)) => `void` |

#### Returns

[`Tracker`](Tracker.Tracker.md)

#### Overrides

EventEmitter.on

#### Defined in

[src/tracker.ts:93](https://github.com/Maaaartin/adb-ts/blob/5393493/src/tracker.ts#L93)

▸ **on**(`event`, `listener`): [`Tracker`](Tracker.Tracker.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"end"`` |
| `listener` | () => `void` |

#### Returns

[`Tracker`](Tracker.Tracker.md)

#### Overrides

EventEmitter.on

#### Defined in

[src/tracker.ts:94](https://github.com/Maaaartin/adb-ts/blob/5393493/src/tracker.ts#L94)

▸ **on**(`event`, `listener`): [`Tracker`](Tracker.Tracker.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"error"`` |
| `listener` | (`err`: `Error`) => `void` |

#### Returns

[`Tracker`](Tracker.Tracker.md)

#### Overrides

EventEmitter.on

#### Defined in

[src/tracker.ts:95](https://github.com/Maaaartin/adb-ts/blob/5393493/src/tracker.ts#L95)

___

### read

▸ `Private` **read**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/tracker.ts:51](https://github.com/Maaaartin/adb-ts/blob/5393493/src/tracker.ts#L51)

___

### update

▸ `Private` **update**(`list`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `list` | [`IDevice`](../interfaces/Util.IDevice.md)[] |

#### Returns

`void`

#### Defined in

[src/tracker.ts:57](https://github.com/Maaaartin/adb-ts/blob/5393493/src/tracker.ts#L57)
