[adb-ts](../README.md) / [Exports](../modules.md) / [Util](../modules/Util.md) / CpOptions

# Interface: CpOptions

[Util](../modules/Util.md).CpOptions

## Hierarchy

- [`NoClobberFSOption`](Util.NoClobberFSOption.md)

- [`SymlinkFSoption`](Util.SymlinkFSoption.md)

- [`RecursiveFSOption`](Util.RecursiveFSOption.md)

  ↳ **`CpOptions`**

## Table of contents

### Properties

- [archive](Util.CpOptions.md#archive)
- [copyToTarget](Util.CpOptions.md#copytotarget)
- [delDest](Util.CpOptions.md#deldest)
- [delFirst](Util.CpOptions.md#delfirst)
- [followAllSymlinks](Util.CpOptions.md#followallsymlinks)
- [followListedSymlinks](Util.CpOptions.md#followlistedsymlinks)
- [hardLink](Util.CpOptions.md#hardlink)
- [noClobber](Util.CpOptions.md#noclobber)
- [noDereference](Util.CpOptions.md#nodereference)
- [noFollowSymlinks](Util.CpOptions.md#nofollowsymlinks)
- [preserve](Util.CpOptions.md#preserve)
- [preserveTimestamps](Util.CpOptions.md#preservetimestamps)
- [recursive](Util.CpOptions.md#recursive)
- [symlink](Util.CpOptions.md#symlink)
- [update](Util.CpOptions.md#update)

## Properties

### archive

• `Optional` **archive**: `boolean`

Adds `-a` flag.
Same as `-dpr`, if specified, `noDereference`, `preserve` and `recursive` attributes are ignored

#### Defined in

[src/util/types.ts:408](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L408)

___

### copyToTarget

• `Optional` **copyToTarget**: `boolean`

Adds `-t` flag.

#### Defined in

[src/util/types.ts:420](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L420)

___

### delDest

• `Optional` **delDest**: `boolean`

Adds `-f` flag.

#### Defined in

[src/util/types.ts:403](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L403)

___

### delFirst

• `Optional` **delFirst**: `boolean`

Adds `-F` flag.

#### Defined in

[src/util/types.ts:399](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L399)

___

### followAllSymlinks

• `Optional` **followAllSymlinks**: `boolean`

Adds `-L` flag.

#### Defined in

[src/util/types.ts:387](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L387)

___

### followListedSymlinks

• `Optional` **followListedSymlinks**: `boolean`

Adds `-H` flag.

#### Defined in

[src/util/types.ts:391](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L391)

___

### hardLink

• `Optional` **hardLink**: `boolean`

Adds `-l` flag.

#### Defined in

[src/util/types.ts:375](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L375)

___

### noClobber

• `Optional` **noClobber**: `boolean`

Adds `-n` flag.
No override.

#### Inherited from

[NoClobberFSOption](Util.NoClobberFSOption.md).[noClobber](Util.NoClobberFSOption.md#noclobber)

#### Defined in

[src/util/types.ts:297](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L297)

___

### noDereference

• `Optional` **noDereference**: `boolean`

Adds `-d` flag.

#### Defined in

[src/util/types.ts:379](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L379)

___

### noFollowSymlinks

• `Optional` **noFollowSymlinks**: `boolean`

Adds `-P` flag.

#### Defined in

[src/util/types.ts:383](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L383)

___

### preserve

• `Optional` **preserve**: [`PreserveOptions`](../modules/Util.md#preserveoptions)

Adds `--preserve=[ATTRIBUTES]`.

#### Defined in

[src/util/types.ts:395](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L395)

___

### preserveTimestamps

• `Optional` **preserveTimestamps**: `boolean`

Adds `-p` flag.

#### Defined in

[src/util/types.ts:416](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L416)

___

### recursive

• `Optional` **recursive**: `boolean`

Adds `-r` flag.

#### Inherited from

[RecursiveFSOption](Util.RecursiveFSOption.md).[recursive](Util.RecursiveFSOption.md#recursive)

#### Defined in

[src/util/types.ts:310](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L310)

___

### symlink

• `Optional` **symlink**: `boolean`

Adds `-s` flag.
Creates symlink.

#### Inherited from

[SymlinkFSoption](Util.SymlinkFSoption.md).[symlink](Util.SymlinkFSoption.md#symlink)

#### Defined in

[src/util/types.ts:304](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L304)

___

### update

• `Optional` **update**: `boolean`

Adds `-u` flag.

#### Defined in

[src/util/types.ts:412](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/types.ts#L412)
