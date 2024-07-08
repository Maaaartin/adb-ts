[adb-ts](../README.md) / [Exports](../modules.md) / [FileStat](../modules/FileStat.md) / FileStat

# Class: FileStat

[FileStat](../modules/FileStat.md).FileStat

## Hierarchy

-   `Stats`

    ↳ **`FileStat`**

## Implements

-   [`IFileStat`](../interfaces/FileStat.IFileStat.md)

## Table of contents

### Constructors

-   [constructor](FileStat.FileStat.md#constructor)

### Properties

-   [abits](FileStat.FileStat.md#abits)
-   [aflags](FileStat.FileStat.md#aflags)
-   [atime](FileStat.FileStat.md#atime)
-   [atimeMs](FileStat.FileStat.md#atimems)
-   [blksize](FileStat.FileStat.md#blksize)
-   [blocks](FileStat.FileStat.md#blocks)
-   [bytes](FileStat.FileStat.md#bytes)
-   [ctime](FileStat.FileStat.md#ctime)
-   [ctimeMs](FileStat.FileStat.md#ctimems)
-   [dTypeMajor](FileStat.FileStat.md#dtypemajor)
-   [dTypeMinor](FileStat.FileStat.md#dtypeminor)
-   [dev](FileStat.FileStat.md#dev)
-   [gid](FileStat.FileStat.md#gid)
-   [gname](FileStat.FileStat.md#gname)
-   [ino](FileStat.FileStat.md#ino)
-   [lname](FileStat.FileStat.md#lname)
-   [mode](FileStat.FileStat.md#mode)
-   [moutpoint](FileStat.FileStat.md#moutpoint)
-   [mtime](FileStat.FileStat.md#mtime)
-   [mtimeMs](FileStat.FileStat.md#mtimems)
-   [name](FileStat.FileStat.md#name)
-   [nlink](FileStat.FileStat.md#nlink)
-   [seccon](FileStat.FileStat.md#seccon)
-   [size](FileStat.FileStat.md#size)
-   [type](FileStat.FileStat.md#type)
-   [uid](FileStat.FileStat.md#uid)
-   [uname](FileStat.FileStat.md#uname)

### Methods

-   [isBlockDevice](FileStat.FileStat.md#isblockdevice)
-   [isCharacterDevice](FileStat.FileStat.md#ischaracterdevice)
-   [isDirectory](FileStat.FileStat.md#isdirectory)
-   [isFIFO](FileStat.FileStat.md#isfifo)
-   [isFile](FileStat.FileStat.md#isfile)
-   [isSocket](FileStat.FileStat.md#issocket)
-   [isSymbolicLink](FileStat.FileStat.md#issymboliclink)

## Constructors

### constructor

• **new FileStat**(`props`)

#### Parameters

| Name    | Type                                               |
| :------ | :------------------------------------------------- |
| `props` | [`IFileStat`](../interfaces/FileStat.IFileStat.md) |

#### Overrides

Stats.constructor

#### Defined in

[src/filestats.ts:61](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L61)

## Properties

### abits

• **abits**: `number`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[abits](../interfaces/FileStat.IFileStat.md#abits)

#### Defined in

[src/filestats.ts:34](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L34)

---

### aflags

• **aflags**: `string`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[aflags](../interfaces/FileStat.IFileStat.md#aflags)

#### Defined in

[src/filestats.ts:35](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L35)

---

### atime

• **atime**: `Date`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[atime](../interfaces/FileStat.IFileStat.md#atime)

#### Overrides

Stats.atime

#### Defined in

[src/filestats.ts:36](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L36)

---

### atimeMs

• **atimeMs**: `number`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[atimeMs](../interfaces/FileStat.IFileStat.md#atimems)

#### Overrides

Stats.atimeMs

#### Defined in

[src/filestats.ts:37](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L37)

---

### blksize

• **blksize**: `number`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[blksize](../interfaces/FileStat.IFileStat.md#blksize)

#### Overrides

Stats.blksize

#### Defined in

[src/filestats.ts:38](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L38)

---

### blocks

• **blocks**: `number`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[blocks](../interfaces/FileStat.IFileStat.md#blocks)

#### Overrides

Stats.blocks

#### Defined in

[src/filestats.ts:39](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L39)

---

### bytes

• **bytes**: `number`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[bytes](../interfaces/FileStat.IFileStat.md#bytes)

#### Defined in

[src/filestats.ts:40](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L40)

---

### ctime

• **ctime**: `Date`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[ctime](../interfaces/FileStat.IFileStat.md#ctime)

#### Overrides

Stats.ctime

#### Defined in

[src/filestats.ts:41](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L41)

---

### ctimeMs

• **ctimeMs**: `number`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[ctimeMs](../interfaces/FileStat.IFileStat.md#ctimems)

#### Overrides

Stats.ctimeMs

#### Defined in

[src/filestats.ts:42](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L42)

---

### dTypeMajor

• **dTypeMajor**: `number`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[dTypeMajor](../interfaces/FileStat.IFileStat.md#dtypemajor)

#### Defined in

[src/filestats.ts:44](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L44)

---

### dTypeMinor

• **dTypeMinor**: `number`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[dTypeMinor](../interfaces/FileStat.IFileStat.md#dtypeminor)

#### Defined in

[src/filestats.ts:45](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L45)

---

### dev

• **dev**: `number`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[dev](../interfaces/FileStat.IFileStat.md#dev)

#### Overrides

Stats.dev

#### Defined in

[src/filestats.ts:43](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L43)

---

### gid

• **gid**: `number`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[gid](../interfaces/FileStat.IFileStat.md#gid)

#### Overrides

Stats.gid

#### Defined in

[src/filestats.ts:47](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L47)

---

### gname

• **gname**: `string`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[gname](../interfaces/FileStat.IFileStat.md#gname)

#### Defined in

[src/filestats.ts:48](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L48)

---

### ino

• **ino**: `number`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[ino](../interfaces/FileStat.IFileStat.md#ino)

#### Overrides

Stats.ino

#### Defined in

[src/filestats.ts:46](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L46)

---

### lname

• **lname**: `string`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[lname](../interfaces/FileStat.IFileStat.md#lname)

#### Defined in

[src/filestats.ts:55](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L55)

---

### mode

• **mode**: `number`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[mode](../interfaces/FileStat.IFileStat.md#mode)

#### Overrides

Stats.mode

#### Defined in

[src/filestats.ts:49](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L49)

---

### moutpoint

• **moutpoint**: `string`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[moutpoint](../interfaces/FileStat.IFileStat.md#moutpoint)

#### Defined in

[src/filestats.ts:50](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L50)

---

### mtime

• **mtime**: `Date`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[mtime](../interfaces/FileStat.IFileStat.md#mtime)

#### Overrides

Stats.mtime

#### Defined in

[src/filestats.ts:51](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L51)

---

### mtimeMs

• **mtimeMs**: `number`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[mtimeMs](../interfaces/FileStat.IFileStat.md#mtimems)

#### Overrides

Stats.mtimeMs

#### Defined in

[src/filestats.ts:52](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L52)

---

### name

• **name**: `string`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[name](../interfaces/FileStat.IFileStat.md#name)

#### Defined in

[src/filestats.ts:53](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L53)

---

### nlink

• **nlink**: `number`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[nlink](../interfaces/FileStat.IFileStat.md#nlink)

#### Overrides

Stats.nlink

#### Defined in

[src/filestats.ts:54](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L54)

---

### seccon

• **seccon**: `string`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[seccon](../interfaces/FileStat.IFileStat.md#seccon)

#### Defined in

[src/filestats.ts:56](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L56)

---

### size

• **size**: `number`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[size](../interfaces/FileStat.IFileStat.md#size)

#### Overrides

Stats.size

#### Defined in

[src/filestats.ts:57](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L57)

---

### type

• **type**: `string`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[type](../interfaces/FileStat.IFileStat.md#type)

#### Defined in

[src/filestats.ts:58](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L58)

---

### uid

• **uid**: `number`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[uid](../interfaces/FileStat.IFileStat.md#uid)

#### Overrides

Stats.uid

#### Defined in

[src/filestats.ts:59](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L59)

---

### uname

• **uname**: `string`

#### Implementation of

[IFileStat](../interfaces/FileStat.IFileStat.md).[uname](../interfaces/FileStat.IFileStat.md#uname)

#### Defined in

[src/filestats.ts:60](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L60)

## Methods

### isBlockDevice

▸ **isBlockDevice**(): `boolean`

#### Returns

`boolean`

#### Overrides

Stats.isBlockDevice

#### Defined in

[src/filestats.ts:108](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L108)

---

### isCharacterDevice

▸ **isCharacterDevice**(): `boolean`

#### Returns

`boolean`

#### Overrides

Stats.isCharacterDevice

#### Defined in

[src/filestats.ts:104](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L104)

---

### isDirectory

▸ **isDirectory**(): `boolean`

#### Returns

`boolean`

#### Overrides

Stats.isDirectory

#### Defined in

[src/filestats.ts:112](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L112)

---

### isFIFO

▸ **isFIFO**(): `boolean`

#### Returns

`boolean`

#### Overrides

Stats.isFIFO

#### Defined in

[src/filestats.ts:96](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L96)

---

### isFile

▸ **isFile**(): `boolean`

#### Returns

`boolean`

#### Overrides

Stats.isFile

#### Defined in

[src/filestats.ts:116](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L116)

---

### isSocket

▸ **isSocket**(): `boolean`

#### Returns

`boolean`

#### Overrides

Stats.isSocket

#### Defined in

[src/filestats.ts:92](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L92)

---

### isSymbolicLink

▸ **isSymbolicLink**(): `boolean`

#### Returns

`boolean`

#### Overrides

Stats.isSymbolicLink

#### Defined in

[src/filestats.ts:100](https://github.com/Maaaartin/adb-ts/blob/5393493/src/filestats.ts#L100)
