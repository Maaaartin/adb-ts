[adb-ts](../README.md) / [Exports](../modules.md) / [Sync](../modules/Sync.md) / Stats

# Class: Stats

[Sync](../modules/Sync.md).Stats

## Hierarchy

-   `Stats`

    ↳ **`Stats`**

    ↳↳ [`SyncEntry`](Sync.SyncEntry.md)

## Table of contents

### Constructors

-   [constructor](Sync.Stats.md#constructor)

### Properties

-   [mode](Sync.Stats.md#mode)
-   [mtime](Sync.Stats.md#mtime)
-   [size](Sync.Stats.md#size)
-   [S_IFBLK](Sync.Stats.md#s_ifblk)
-   [S_IFCHR](Sync.Stats.md#s_ifchr)
-   [S_IFDIR](Sync.Stats.md#s_ifdir)
-   [S_IFIFO](Sync.Stats.md#s_ififo)
-   [S_IFLNK](Sync.Stats.md#s_iflnk)
-   [S_IFMT](Sync.Stats.md#s_ifmt)
-   [S_IFREG](Sync.Stats.md#s_ifreg)
-   [S_IFSOCK](Sync.Stats.md#s_ifsock)
-   [S_IRGRP](Sync.Stats.md#s_irgrp)
-   [S_IRUSR](Sync.Stats.md#s_irusr)
-   [S_IRWXG](Sync.Stats.md#s_irwxg)
-   [S_IRWXU](Sync.Stats.md#s_irwxu)
-   [S_ISGID](Sync.Stats.md#s_isgid)
-   [S_ISUID](Sync.Stats.md#s_isuid)
-   [S_ISVTX](Sync.Stats.md#s_isvtx)
-   [S_IWUSR](Sync.Stats.md#s_iwusr)
-   [S_IXUSR](Sync.Stats.md#s_ixusr)

## Constructors

### constructor

• **new Stats**(`mode`, `size`, `mtime`)

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `mode`  | `number` |
| `size`  | `number` |
| `mtime` | `number` |

#### Overrides

fs.Stats.constructor

#### Defined in

[src/sync/stats.ts:41](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L41)

## Properties

### mode

• `Readonly` **mode**: `number`

#### Overrides

fs.Stats.mode

#### Defined in

[src/sync/stats.ts:4](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L4)

---

### mtime

• `Readonly` **mtime**: `Date`

#### Overrides

fs.Stats.mtime

#### Defined in

[src/sync/stats.ts:6](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L6)

---

### size

• `Readonly` **size**: `number`

#### Overrides

fs.Stats.size

#### Defined in

[src/sync/stats.ts:5](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L5)

---

### S_IFBLK

▪ `Static` `Readonly` **S_IFBLK**: `24576`

#### Defined in

[src/sync/stats.ts:16](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L16)

---

### S_IFCHR

▪ `Static` `Readonly` **S_IFCHR**: `8192`

#### Defined in

[src/sync/stats.ts:20](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L20)

---

### S_IFDIR

▪ `Static` `Readonly` **S_IFDIR**: `16384`

#### Defined in

[src/sync/stats.ts:18](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L18)

---

### S_IFIFO

▪ `Static` `Readonly` **S_IFIFO**: `4096`

#### Defined in

[src/sync/stats.ts:22](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L22)

---

### S_IFLNK

▪ `Static` `Readonly` **S_IFLNK**: `40960`

#### Defined in

[src/sync/stats.ts:12](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L12)

---

### S_IFMT

▪ `Static` `Readonly` **S_IFMT**: `61440`

#### Defined in

[src/sync/stats.ts:8](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L8)

---

### S_IFREG

▪ `Static` `Readonly` **S_IFREG**: `32768`

#### Defined in

[src/sync/stats.ts:14](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L14)

---

### S_IFSOCK

▪ `Static` `Readonly` **S_IFSOCK**: `49152`

#### Defined in

[src/sync/stats.ts:10](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L10)

---

### S_IRGRP

▪ `Static` `Readonly` **S_IRGRP**: `32`

#### Defined in

[src/sync/stats.ts:40](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L40)

---

### S_IRUSR

▪ `Static` `Readonly` **S_IRUSR**: `256`

#### Defined in

[src/sync/stats.ts:32](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L32)

---

### S_IRWXG

▪ `Static` `Readonly` **S_IRWXG**: `56`

#### Defined in

[src/sync/stats.ts:38](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L38)

---

### S_IRWXU

▪ `Static` `Readonly` **S_IRWXU**: `448`

#### Defined in

[src/sync/stats.ts:30](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L30)

---

### S_ISGID

▪ `Static` `Readonly` **S_ISGID**: `1024`

#### Defined in

[src/sync/stats.ts:26](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L26)

---

### S_ISUID

▪ `Static` `Readonly` **S_ISUID**: `2048`

#### Defined in

[src/sync/stats.ts:24](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L24)

---

### S_ISVTX

▪ `Static` `Readonly` **S_ISVTX**: `512`

#### Defined in

[src/sync/stats.ts:28](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L28)

---

### S_IWUSR

▪ `Static` `Readonly` **S_IWUSR**: `128`

#### Defined in

[src/sync/stats.ts:34](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L34)

---

### S_IXUSR

▪ `Static` `Readonly` **S_IXUSR**: `64`

#### Defined in

[src/sync/stats.ts:36](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L36)
