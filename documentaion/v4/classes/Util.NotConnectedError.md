[adb-ts](../README.md) / [Exports](../modules.md) / [Util](../modules/Util.md) / NotConnectedError

# Class: NotConnectedError

[Util](../modules/Util.md).NotConnectedError

## Hierarchy

- `Error`

  ↳ **`NotConnectedError`**

## Table of contents

### Constructors

- [constructor](Util.NotConnectedError.md#constructor)

### Properties

- [message](Util.NotConnectedError.md#message)
- [name](Util.NotConnectedError.md#name)

## Constructors

### constructor

• **new NotConnectedError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

Error.constructor

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1073

## Properties

### message

• **message**: `string` = `'Client not connected. `connect` function must be called before use.'`

#### Overrides

Error.message

#### Defined in

[src/util/errors.ts:25](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/errors.ts#L25)

___

### name

• **name**: `string` = `'NotConnectedError'`

#### Overrides

Error.name

#### Defined in

[src/util/errors.ts:24](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/errors.ts#L24)
