[adb-ts](../README.md) / [Exports](../modules.md) / [Sync](../modules/Sync.md) / SyncEntry

# Class: SyncEntry

[Sync](../modules/Sync.md).SyncEntry

## Hierarchy

-   [`Stats`](Sync.Stats.md)

    ↳ **`SyncEntry`**

## Table of contents

### Constructors

-   [constructor](Sync.SyncEntry.md#constructor)

### Properties

-   [mode](Sync.SyncEntry.md#mode)
-   [mtime](Sync.SyncEntry.md#mtime)
-   [name](Sync.SyncEntry.md#name)
-   [size](Sync.SyncEntry.md#size)
-   [S_IFBLK](Sync.SyncEntry.md#s_ifblk)
-   [S_IFCHR](Sync.SyncEntry.md#s_ifchr)
-   [S_IFDIR](Sync.SyncEntry.md#s_ifdir)
-   [S_IFIFO](Sync.SyncEntry.md#s_ififo)
-   [S_IFLNK](Sync.SyncEntry.md#s_iflnk)
-   [S_IFMT](Sync.SyncEntry.md#s_ifmt)
-   [S_IFREG](Sync.SyncEntry.md#s_ifreg)
-   [S_IFSOCK](Sync.SyncEntry.md#s_ifsock)
-   [S_IRGRP](Sync.SyncEntry.md#s_irgrp)
-   [S_IRUSR](Sync.SyncEntry.md#s_irusr)
-   [S_IRWXG](Sync.SyncEntry.md#s_irwxg)
-   [S_IRWXU](Sync.SyncEntry.md#s_irwxu)
-   [S_ISGID](Sync.SyncEntry.md#s_isgid)
-   [S_ISUID](Sync.SyncEntry.md#s_isuid)
-   [S_ISVTX](Sync.SyncEntry.md#s_isvtx)
-   [S_IWUSR](Sync.SyncEntry.md#s_iwusr)
-   [S_IXUSR](Sync.SyncEntry.md#s_ixusr)

## Constructors

### constructor

• **new SyncEntry**(`name`, `mode`, `size`, `mtime`)

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `name`  | `string` |
| `mode`  | `number` |
| `size`  | `number` |
| `mtime` | `number` |

#### Overrides

[Stats](Sync.Stats.md).[constructor](Sync.Stats.md#constructor)

#### Defined in

[src/sync/entry.ts:5](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/entry.ts#L5)

## Properties

### mode

• `Readonly` **mode**: `number`

#### Inherited from

[Stats](Sync.Stats.md).[mode](Sync.Stats.md#mode)

#### Defined in

[src/sync/stats.ts:4](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L4)

---

### mtime

• `Readonly` **mtime**: `Date`

#### Inherited from

[Stats](Sync.Stats.md).[mtime](Sync.Stats.md#mtime)

#### Defined in

[src/sync/stats.ts:6](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L6)

---

### name

• `Readonly` **name**: `string`

#### Defined in

[src/sync/entry.ts:4](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/entry.ts#L4)

---

### size

• `Readonly` **size**: `number`

#### Inherited from

[Stats](Sync.Stats.md).[size](Sync.Stats.md#size)

#### Defined in

[src/sync/stats.ts:5](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L5)

---

### S_IFBLK

▪ `Static` `Readonly` **S_IFBLK**: `24576`

#### Inherited from

[Stats](Sync.Stats.md).[S_IFBLK](Sync.Stats.md#s_ifblk)

#### Defined in

[src/sync/stats.ts:16](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L16)

---

### S_IFCHR

▪ `Static` `Readonly` **S_IFCHR**: `8192`

#### Inherited from

[Stats](Sync.Stats.md).[S_IFCHR](Sync.Stats.md#s_ifchr)

#### Defined in

[src/sync/stats.ts:20](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L20)

---

### S_IFDIR

▪ `Static` `Readonly` **S_IFDIR**: `16384`

#### Inherited from

[Stats](Sync.Stats.md).[S_IFDIR](Sync.Stats.md#s_ifdir)

#### Defined in

[src/sync/stats.ts:18](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L18)

---

### S_IFIFO

▪ `Static` `Readonly` **S_IFIFO**: `4096`

#### Inherited from

[Stats](Sync.Stats.md).[S_IFIFO](Sync.Stats.md#s_ififo)

#### Defined in

[src/sync/stats.ts:22](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L22)

---

### S_IFLNK

▪ `Static` `Readonly` **S_IFLNK**: `40960`

#### Inherited from

[Stats](Sync.Stats.md).[S_IFLNK](Sync.Stats.md#s_iflnk)

#### Defined in

[src/sync/stats.ts:12](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L12)

---

### S_IFMT

▪ `Static` `Readonly` **S_IFMT**: `61440`

#### Inherited from

[Stats](Sync.Stats.md).[S_IFMT](Sync.Stats.md#s_ifmt)

#### Defined in

[src/sync/stats.ts:8](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L8)

---

### S_IFREG

▪ `Static` `Readonly` **S_IFREG**: `32768`

#### Inherited from

[Stats](Sync.Stats.md).[S_IFREG](Sync.Stats.md#s_ifreg)

#### Defined in

[src/sync/stats.ts:14](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L14)

---

### S_IFSOCK

▪ `Static` `Readonly` **S_IFSOCK**: `49152`

#### Inherited from

[Stats](Sync.Stats.md).[S_IFSOCK](Sync.Stats.md#s_ifsock)

#### Defined in

[src/sync/stats.ts:10](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L10)

---

### S_IRGRP

▪ `Static` `Readonly` **S_IRGRP**: `32`

#### Inherited from

[Stats](Sync.Stats.md).[S_IRGRP](Sync.Stats.md#s_irgrp)

#### Defined in

[src/sync/stats.ts:40](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L40)

---

### S_IRUSR

▪ `Static` `Readonly` **S_IRUSR**: `256`

#### Inherited from

[Stats](Sync.Stats.md).[S_IRUSR](Sync.Stats.md#s_irusr)

#### Defined in

[src/sync/stats.ts:32](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L32)

---

### S_IRWXG

▪ `Static` `Readonly` **S_IRWXG**: `56`

#### Inherited from

[Stats](Sync.Stats.md).[S_IRWXG](Sync.Stats.md#s_irwxg)

#### Defined in

[src/sync/stats.ts:38](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L38)

---

### S_IRWXU

▪ `Static` `Readonly` **S_IRWXU**: `448`

#### Inherited from

[Stats](Sync.Stats.md).[S_IRWXU](Sync.Stats.md#s_irwxu)

#### Defined in

[src/sync/stats.ts:30](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L30)

---

### S_ISGID

▪ `Static` `Readonly` **S_ISGID**: `1024`

#### Inherited from

[Stats](Sync.Stats.md).[S_ISGID](Sync.Stats.md#s_isgid)

#### Defined in

[src/sync/stats.ts:26](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L26)

---

### S_ISUID

▪ `Static` `Readonly` **S_ISUID**: `2048`

#### Inherited from

[Stats](Sync.Stats.md).[S_ISUID](Sync.Stats.md#s_isuid)

#### Defined in

[src/sync/stats.ts:24](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L24)

---

### S_ISVTX

▪ `Static` `Readonly` **S_ISVTX**: `512`

#### Inherited from

[Stats](Sync.Stats.md).[S_ISVTX](Sync.Stats.md#s_isvtx)

#### Defined in

[src/sync/stats.ts:28](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L28)

---

### S_IWUSR

▪ `Static` `Readonly` **S_IWUSR**: `128`

#### Inherited from

[Stats](Sync.Stats.md).[S_IWUSR](Sync.Stats.md#s_iwusr)

#### Defined in

[src/sync/stats.ts:34](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L34)

---

### S_IXUSR

▪ `Static` `Readonly` **S_IXUSR**: `64`

#### Inherited from

[Stats](Sync.Stats.md).[S_IXUSR](Sync.Stats.md#s_ixusr)

#### Defined in

[src/sync/stats.ts:36](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L36)
