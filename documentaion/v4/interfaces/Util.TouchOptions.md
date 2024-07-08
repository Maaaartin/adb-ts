[adb-ts](../README.md) / [Exports](../modules.md) / [Util](../modules/Util.md) / TouchOptions

# Interface: TouchOptions

[Util](../modules/Util.md).TouchOptions

## Hierarchy

-   [`SymlinkFSoption`](Util.SymlinkFSoption.md)

    ↳ **`TouchOptions`**

## Table of contents

### Properties

-   [aTime](Util.TouchOptions.md#atime)
-   [date](Util.TouchOptions.md#date)
-   [mTime](Util.TouchOptions.md#mtime)
-   [noCreate](Util.TouchOptions.md#nocreate)
-   [reference](Util.TouchOptions.md#reference)
-   [symlink](Util.TouchOptions.md#symlink)
-   [time](Util.TouchOptions.md#time)

## Properties

### aTime

• `Optional` **aTime**: `boolean`

Adds `-a` flag. Changes access time.

#### Defined in

[src/util/types.ts:331](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L331)

---

### date

• `Optional` **date**: `string` \| `Date`

Adds `-d <date>` flag.

#### Defined in

[src/util/types.ts:343](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L343)

---

### mTime

• `Optional` **mTime**: `boolean`

Adds `-m` flag. Changes modification time.

#### Defined in

[src/util/types.ts:335](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L335)

---

### noCreate

• `Optional` **noCreate**: `boolean`

Adds `-m` flag. Does not create file. Does not create file.

#### Defined in

[src/util/types.ts:339](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L339)

---

### reference

• `Optional` **reference**: `string`

Adds `-r <reference>` flag.

#### Defined in

[src/util/types.ts:351](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L351)

---

### symlink

• `Optional` **symlink**: `boolean`

Adds `-s` flag.
Creates symlink.

#### Inherited from

[SymlinkFSoption](Util.SymlinkFSoption.md).[symlink](Util.SymlinkFSoption.md#symlink)

#### Defined in

[src/util/types.ts:304](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L304)

---

### time

• `Optional` **time**: `string` \| `Date`

Adds `-t <time>` flag.

#### Defined in

[src/util/types.ts:347](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L347)
