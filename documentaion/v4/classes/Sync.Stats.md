[adb-ts](../README.md) / [Exports](../modules.md) / [Sync](../modules/Sync.md) / Stats

# Class: Stats

[Sync](../modules/Sync.md).Stats

## Hierarchy

- `Stats`

  ↳ **`Stats`**

  ↳↳ [`SyncEntry`](Sync.SyncEntry.md)

## Table of contents

### Constructors

- [constructor](Sync.Stats.md#constructor)

### Properties

- [mode](Sync.Stats.md#mode)
- [mtime](Sync.Stats.md#mtime)
- [size](Sync.Stats.md#size)
- [S\_IFBLK](Sync.Stats.md#s_ifblk)
- [S\_IFCHR](Sync.Stats.md#s_ifchr)
- [S\_IFDIR](Sync.Stats.md#s_ifdir)
- [S\_IFIFO](Sync.Stats.md#s_ififo)
- [S\_IFLNK](Sync.Stats.md#s_iflnk)
- [S\_IFMT](Sync.Stats.md#s_ifmt)
- [S\_IFREG](Sync.Stats.md#s_ifreg)
- [S\_IFSOCK](Sync.Stats.md#s_ifsock)
- [S\_IRGRP](Sync.Stats.md#s_irgrp)
- [S\_IRUSR](Sync.Stats.md#s_irusr)
- [S\_IRWXG](Sync.Stats.md#s_irwxg)
- [S\_IRWXU](Sync.Stats.md#s_irwxu)
- [S\_ISGID](Sync.Stats.md#s_isgid)
- [S\_ISUID](Sync.Stats.md#s_isuid)
- [S\_ISVTX](Sync.Stats.md#s_isvtx)
- [S\_IWUSR](Sync.Stats.md#s_iwusr)
- [S\_IXUSR](Sync.Stats.md#s_ixusr)

## Constructors

### constructor

• **new Stats**(`mode`, `size`, `mtime`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `mode` | `number` |
| `size` | `number` |
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

___

### mtime

• `Readonly` **mtime**: `Date`

#### Overrides

fs.Stats.mtime

#### Defined in

[src/sync/stats.ts:6](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L6)

___

### size

• `Readonly` **size**: `number`

#### Overrides

fs.Stats.size

#### Defined in

[src/sync/stats.ts:5](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L5)

___

### S\_IFBLK

▪ `Static` `Readonly` **S\_IFBLK**: ``24576``

#### Defined in

[src/sync/stats.ts:16](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L16)

___

### S\_IFCHR

▪ `Static` `Readonly` **S\_IFCHR**: ``8192``

#### Defined in

[src/sync/stats.ts:20](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L20)

___

### S\_IFDIR

▪ `Static` `Readonly` **S\_IFDIR**: ``16384``

#### Defined in

[src/sync/stats.ts:18](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L18)

___

### S\_IFIFO

▪ `Static` `Readonly` **S\_IFIFO**: ``4096``

#### Defined in

[src/sync/stats.ts:22](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L22)

___

### S\_IFLNK

▪ `Static` `Readonly` **S\_IFLNK**: ``40960``

#### Defined in

[src/sync/stats.ts:12](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L12)

___

### S\_IFMT

▪ `Static` `Readonly` **S\_IFMT**: ``61440``

#### Defined in

[src/sync/stats.ts:8](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L8)

___

### S\_IFREG

▪ `Static` `Readonly` **S\_IFREG**: ``32768``

#### Defined in

[src/sync/stats.ts:14](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L14)

___

### S\_IFSOCK

▪ `Static` `Readonly` **S\_IFSOCK**: ``49152``

#### Defined in

[src/sync/stats.ts:10](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L10)

___

### S\_IRGRP

▪ `Static` `Readonly` **S\_IRGRP**: ``32``

#### Defined in

[src/sync/stats.ts:40](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L40)

___

### S\_IRUSR

▪ `Static` `Readonly` **S\_IRUSR**: ``256``

#### Defined in

[src/sync/stats.ts:32](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L32)

___

### S\_IRWXG

▪ `Static` `Readonly` **S\_IRWXG**: ``56``

#### Defined in

[src/sync/stats.ts:38](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L38)

___

### S\_IRWXU

▪ `Static` `Readonly` **S\_IRWXU**: ``448``

#### Defined in

[src/sync/stats.ts:30](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L30)

___

### S\_ISGID

▪ `Static` `Readonly` **S\_ISGID**: ``1024``

#### Defined in

[src/sync/stats.ts:26](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L26)

___

### S\_ISUID

▪ `Static` `Readonly` **S\_ISUID**: ``2048``

#### Defined in

[src/sync/stats.ts:24](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L24)

___

### S\_ISVTX

▪ `Static` `Readonly` **S\_ISVTX**: ``512``

#### Defined in

[src/sync/stats.ts:28](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L28)

___

### S\_IWUSR

▪ `Static` `Readonly` **S\_IWUSR**: ``128``

#### Defined in

[src/sync/stats.ts:34](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L34)

___

### S\_IXUSR

▪ `Static` `Readonly` **S\_IXUSR**: ``64``

#### Defined in

[src/sync/stats.ts:36](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L36)
