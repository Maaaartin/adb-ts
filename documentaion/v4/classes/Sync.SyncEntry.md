[adb-ts](../README.md) / [Exports](../modules.md) / [Sync](../modules/Sync.md) / SyncEntry

# Class: SyncEntry

[Sync](../modules/Sync.md).SyncEntry

## Hierarchy

- [`Stats`](Sync.Stats.md)

  ↳ **`SyncEntry`**

## Table of contents

### Constructors

- [constructor](Sync.SyncEntry.md#constructor)

### Properties

- [mode](Sync.SyncEntry.md#mode)
- [mtime](Sync.SyncEntry.md#mtime)
- [name](Sync.SyncEntry.md#name)
- [size](Sync.SyncEntry.md#size)
- [S\_IFBLK](Sync.SyncEntry.md#s_ifblk)
- [S\_IFCHR](Sync.SyncEntry.md#s_ifchr)
- [S\_IFDIR](Sync.SyncEntry.md#s_ifdir)
- [S\_IFIFO](Sync.SyncEntry.md#s_ififo)
- [S\_IFLNK](Sync.SyncEntry.md#s_iflnk)
- [S\_IFMT](Sync.SyncEntry.md#s_ifmt)
- [S\_IFREG](Sync.SyncEntry.md#s_ifreg)
- [S\_IFSOCK](Sync.SyncEntry.md#s_ifsock)
- [S\_IRGRP](Sync.SyncEntry.md#s_irgrp)
- [S\_IRUSR](Sync.SyncEntry.md#s_irusr)
- [S\_IRWXG](Sync.SyncEntry.md#s_irwxg)
- [S\_IRWXU](Sync.SyncEntry.md#s_irwxu)
- [S\_ISGID](Sync.SyncEntry.md#s_isgid)
- [S\_ISUID](Sync.SyncEntry.md#s_isuid)
- [S\_ISVTX](Sync.SyncEntry.md#s_isvtx)
- [S\_IWUSR](Sync.SyncEntry.md#s_iwusr)
- [S\_IXUSR](Sync.SyncEntry.md#s_ixusr)

## Constructors

### constructor

• **new SyncEntry**(`name`, `mode`, `size`, `mtime`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `mode` | `number` |
| `size` | `number` |
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

___

### mtime

• `Readonly` **mtime**: `Date`

#### Inherited from

[Stats](Sync.Stats.md).[mtime](Sync.Stats.md#mtime)

#### Defined in

[src/sync/stats.ts:6](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L6)

___

### name

• `Readonly` **name**: `string`

#### Defined in

[src/sync/entry.ts:4](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/entry.ts#L4)

___

### size

• `Readonly` **size**: `number`

#### Inherited from

[Stats](Sync.Stats.md).[size](Sync.Stats.md#size)

#### Defined in

[src/sync/stats.ts:5](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L5)

___

### S\_IFBLK

▪ `Static` `Readonly` **S\_IFBLK**: ``24576``

#### Inherited from

[Stats](Sync.Stats.md).[S_IFBLK](Sync.Stats.md#s_ifblk)

#### Defined in

[src/sync/stats.ts:16](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L16)

___

### S\_IFCHR

▪ `Static` `Readonly` **S\_IFCHR**: ``8192``

#### Inherited from

[Stats](Sync.Stats.md).[S_IFCHR](Sync.Stats.md#s_ifchr)

#### Defined in

[src/sync/stats.ts:20](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L20)

___

### S\_IFDIR

▪ `Static` `Readonly` **S\_IFDIR**: ``16384``

#### Inherited from

[Stats](Sync.Stats.md).[S_IFDIR](Sync.Stats.md#s_ifdir)

#### Defined in

[src/sync/stats.ts:18](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L18)

___

### S\_IFIFO

▪ `Static` `Readonly` **S\_IFIFO**: ``4096``

#### Inherited from

[Stats](Sync.Stats.md).[S_IFIFO](Sync.Stats.md#s_ififo)

#### Defined in

[src/sync/stats.ts:22](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L22)

___

### S\_IFLNK

▪ `Static` `Readonly` **S\_IFLNK**: ``40960``

#### Inherited from

[Stats](Sync.Stats.md).[S_IFLNK](Sync.Stats.md#s_iflnk)

#### Defined in

[src/sync/stats.ts:12](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L12)

___

### S\_IFMT

▪ `Static` `Readonly` **S\_IFMT**: ``61440``

#### Inherited from

[Stats](Sync.Stats.md).[S_IFMT](Sync.Stats.md#s_ifmt)

#### Defined in

[src/sync/stats.ts:8](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L8)

___

### S\_IFREG

▪ `Static` `Readonly` **S\_IFREG**: ``32768``

#### Inherited from

[Stats](Sync.Stats.md).[S_IFREG](Sync.Stats.md#s_ifreg)

#### Defined in

[src/sync/stats.ts:14](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L14)

___

### S\_IFSOCK

▪ `Static` `Readonly` **S\_IFSOCK**: ``49152``

#### Inherited from

[Stats](Sync.Stats.md).[S_IFSOCK](Sync.Stats.md#s_ifsock)

#### Defined in

[src/sync/stats.ts:10](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L10)

___

### S\_IRGRP

▪ `Static` `Readonly` **S\_IRGRP**: ``32``

#### Inherited from

[Stats](Sync.Stats.md).[S_IRGRP](Sync.Stats.md#s_irgrp)

#### Defined in

[src/sync/stats.ts:40](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L40)

___

### S\_IRUSR

▪ `Static` `Readonly` **S\_IRUSR**: ``256``

#### Inherited from

[Stats](Sync.Stats.md).[S_IRUSR](Sync.Stats.md#s_irusr)

#### Defined in

[src/sync/stats.ts:32](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L32)

___

### S\_IRWXG

▪ `Static` `Readonly` **S\_IRWXG**: ``56``

#### Inherited from

[Stats](Sync.Stats.md).[S_IRWXG](Sync.Stats.md#s_irwxg)

#### Defined in

[src/sync/stats.ts:38](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L38)

___

### S\_IRWXU

▪ `Static` `Readonly` **S\_IRWXU**: ``448``

#### Inherited from

[Stats](Sync.Stats.md).[S_IRWXU](Sync.Stats.md#s_irwxu)

#### Defined in

[src/sync/stats.ts:30](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L30)

___

### S\_ISGID

▪ `Static` `Readonly` **S\_ISGID**: ``1024``

#### Inherited from

[Stats](Sync.Stats.md).[S_ISGID](Sync.Stats.md#s_isgid)

#### Defined in

[src/sync/stats.ts:26](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L26)

___

### S\_ISUID

▪ `Static` `Readonly` **S\_ISUID**: ``2048``

#### Inherited from

[Stats](Sync.Stats.md).[S_ISUID](Sync.Stats.md#s_isuid)

#### Defined in

[src/sync/stats.ts:24](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L24)

___

### S\_ISVTX

▪ `Static` `Readonly` **S\_ISVTX**: ``512``

#### Inherited from

[Stats](Sync.Stats.md).[S_ISVTX](Sync.Stats.md#s_isvtx)

#### Defined in

[src/sync/stats.ts:28](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L28)

___

### S\_IWUSR

▪ `Static` `Readonly` **S\_IWUSR**: ``128``

#### Inherited from

[Stats](Sync.Stats.md).[S_IWUSR](Sync.Stats.md#s_iwusr)

#### Defined in

[src/sync/stats.ts:34](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L34)

___

### S\_IXUSR

▪ `Static` `Readonly` **S\_IXUSR**: ``64``

#### Inherited from

[Stats](Sync.Stats.md).[S_IXUSR](Sync.Stats.md#s_ixusr)

#### Defined in

[src/sync/stats.ts:36](https://github.com/Maaaartin/adb-ts/blob/5393493/src/sync/stats.ts#L36)
