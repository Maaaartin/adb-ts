[adb-ts](../README.md) / [Exports](../modules.md) / [Util](../modules/Util.md) / StartActivityOptions

# Interface: StartActivityOptions

[Util](../modules/Util.md).StartActivityOptions

## Hierarchy

-   [`StartServiceOptions`](Util.StartServiceOptions.md)

    ↳ **`StartActivityOptions`**

## Table of contents

### Properties

-   [action](Util.StartActivityOptions.md#action)
-   [category](Util.StartActivityOptions.md#category)
-   [data](Util.StartActivityOptions.md#data)
-   [debug](Util.StartActivityOptions.md#debug)
-   [extras](Util.StartActivityOptions.md#extras)
-   [flags](Util.StartActivityOptions.md#flags)
-   [mimeType](Util.StartActivityOptions.md#mimetype)
-   [user](Util.StartActivityOptions.md#user)
-   [wait](Util.StartActivityOptions.md#wait)

## Properties

### action

• `Optional` **action**: `string`

Adds `-a` flag.

#### Inherited from

[StartServiceOptions](Util.StartServiceOptions.md).[action](Util.StartServiceOptions.md#action)

#### Defined in

[src/util/types.ts:78](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L78)

---

### category

• `Optional` **category**: `string` \| `string`[]

Adds `-c` flag.

#### Inherited from

[StartServiceOptions](Util.StartServiceOptions.md).[category](Util.StartServiceOptions.md#category)

#### Defined in

[src/util/types.ts:90](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L90)

---

### data

• `Optional` **data**: `string`

Adds `-D` flag.

#### Inherited from

[StartServiceOptions](Util.StartServiceOptions.md).[data](Util.StartServiceOptions.md#data)

#### Defined in

[src/util/types.ts:82](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L82)

---

### debug

• `Optional` **debug**: `boolean`

Adds `-D` flag.

#### Defined in

[src/util/types.ts:99](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L99)

---

### extras

• `Optional` **extras**: [`StartExtra`](../modules/Util.md#startextra) \| [`StartExtra`](../modules/Util.md#startextra)[]

#### Inherited from

[StartServiceOptions](Util.StartServiceOptions.md).[extras](Util.StartServiceOptions.md#extras)

#### Defined in

[src/util/types.ts:92](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L92)

---

### flags

• `Optional` **flags**: `number`

#### Inherited from

[StartServiceOptions](Util.StartServiceOptions.md).[flags](Util.StartServiceOptions.md#flags)

#### Defined in

[src/util/types.ts:91](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L91)

---

### mimeType

• `Optional` **mimeType**: `string`

Adds `-t` flag.

#### Inherited from

[StartServiceOptions](Util.StartServiceOptions.md).[mimeType](Util.StartServiceOptions.md#mimetype)

#### Defined in

[src/util/types.ts:86](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L86)

---

### user

• `Optional` **user**: `string` \| `number`

default `0`

#### Inherited from

[StartServiceOptions](Util.StartServiceOptions.md).[user](Util.StartServiceOptions.md#user)

#### Defined in

[src/util/types.ts:74](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L74)

---

### wait

• `Optional` **wait**: `boolean`

Adds `-W` flag.

#### Defined in

[src/util/types.ts:103](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L103)
