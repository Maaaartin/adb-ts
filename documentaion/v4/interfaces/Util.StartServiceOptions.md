[adb-ts](../README.md) / [Exports](../modules.md) / [Util](../modules/Util.md) / StartServiceOptions

# Interface: StartServiceOptions

[Util](../modules/Util.md).StartServiceOptions

## Hierarchy

- **`StartServiceOptions`**

  ↳ [`StartActivityOptions`](Util.StartActivityOptions.md)

## Table of contents

### Properties

- [action](Util.StartServiceOptions.md#action)
- [category](Util.StartServiceOptions.md#category)
- [data](Util.StartServiceOptions.md#data)
- [extras](Util.StartServiceOptions.md#extras)
- [flags](Util.StartServiceOptions.md#flags)
- [mimeType](Util.StartServiceOptions.md#mimetype)
- [user](Util.StartServiceOptions.md#user)

## Properties

### action

• `Optional` **action**: `string`

Adds `-a` flag.

#### Defined in

[src/util/types.ts:78](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L78)

___

### category

• `Optional` **category**: `string` \| `string`[]

Adds `-c` flag.

#### Defined in

[src/util/types.ts:90](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L90)

___

### data

• `Optional` **data**: `string`

Adds `-D` flag.

#### Defined in

[src/util/types.ts:82](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L82)

___

### extras

• `Optional` **extras**: [`StartExtra`](../modules/Util.md#startextra) \| [`StartExtra`](../modules/Util.md#startextra)[]

#### Defined in

[src/util/types.ts:92](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L92)

___

### flags

• `Optional` **flags**: `number`

#### Defined in

[src/util/types.ts:91](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L91)

___

### mimeType

• `Optional` **mimeType**: `string`

Adds `-t` flag.

#### Defined in

[src/util/types.ts:86](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L86)

___

### user

• `Optional` **user**: `string` \| `number`

default `0`

#### Defined in

[src/util/types.ts:74](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L74)
