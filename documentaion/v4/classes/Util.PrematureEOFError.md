[adb-ts](../README.md) / [Exports](../modules.md) / [Util](../modules/Util.md) / PrematureEOFError

# Class: PrematureEOFError

[Util](../modules/Util.md).PrematureEOFError

## Hierarchy

-   `Error`

    ↳ **`PrematureEOFError`**

## Table of contents

### Constructors

-   [constructor](Util.PrematureEOFError.md#constructor)

### Properties

-   [missingBytes](Util.PrematureEOFError.md#missingbytes)
-   [name](Util.PrematureEOFError.md#name)

## Constructors

### constructor

• **new PrematureEOFError**(`howManyMissing`)

#### Parameters

| Name             | Type     |
| :--------------- | :------- |
| `howManyMissing` | `number` |

#### Overrides

Error.constructor

#### Defined in

[src/util/errors.ts:15](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/errors.ts#L15)

## Properties

### missingBytes

• **missingBytes**: `number`

#### Defined in

[src/util/errors.ts:14](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/errors.ts#L14)

---

### name

• **name**: `string` = `'PrematureEOFError'`

#### Overrides

Error.name

#### Defined in

[src/util/errors.ts:13](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/errors.ts#L13)
