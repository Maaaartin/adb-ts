[adb-ts](../README.md) / [Exports](../modules.md) / [Util](../modules/Util.md) / UnexpectedDataError

# Class: UnexpectedDataError

[Util](../modules/Util.md).UnexpectedDataError

## Hierarchy

-   `Error`

    ↳ **`UnexpectedDataError`**

## Table of contents

### Constructors

-   [constructor](Util.UnexpectedDataError.md#constructor)

### Properties

-   [expected](Util.UnexpectedDataError.md#expected)
-   [name](Util.UnexpectedDataError.md#name)
-   [unexpected](Util.UnexpectedDataError.md#unexpected)

## Constructors

### constructor

• **new UnexpectedDataError**(`unexpected`, `expected`)

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `unexpected` | `string` |
| `expected`   | `string` |

#### Overrides

Error.constructor

#### Defined in

[src/util/errors.ts:5](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/errors.ts#L5)

## Properties

### expected

• **expected**: `string`

#### Defined in

[src/util/errors.ts:4](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/errors.ts#L4)

---

### name

• **name**: `string` = `'UnexpectedDataError'`

#### Overrides

Error.name

#### Defined in

[src/util/errors.ts:2](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/errors.ts#L2)

---

### unexpected

• **unexpected**: `string`

#### Defined in

[src/util/errors.ts:3](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/errors.ts#L3)
