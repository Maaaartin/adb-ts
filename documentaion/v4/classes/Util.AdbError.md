[adb-ts](../README.md) / [Exports](../modules.md) / [Util](../modules/Util.md) / AdbError

# Class: AdbError

[Util](../modules/Util.md).AdbError

## Hierarchy

-   `Error`

    ↳ **`AdbError`**

## Table of contents

### Constructors

-   [constructor](Util.AdbError.md#constructor)

### Properties

-   [code](Util.AdbError.md#code)
-   [errno](Util.AdbError.md#errno)
-   [name](Util.AdbError.md#name)
-   [path](Util.AdbError.md#path)

## Constructors

### constructor

• **new AdbError**(`message`, `errno`, `code`, `path`)

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `message` | `string` |
| `errno`   | `number` |
| `code`    | `string` |
| `path`    | `string` |

#### Overrides

Error.constructor

#### Defined in

[src/util/errors.ts:33](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/errors.ts#L33)

## Properties

### code

• **code**: `string`

#### Defined in

[src/util/errors.ts:31](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/errors.ts#L31)

---

### errno

• **errno**: `number`

#### Defined in

[src/util/errors.ts:30](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/errors.ts#L30)

---

### name

• **name**: `string` = `'AdbError'`

#### Overrides

Error.name

#### Defined in

[src/util/errors.ts:29](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/errors.ts#L29)

---

### path

• **path**: `string`

#### Defined in

[src/util/errors.ts:32](https://github.com/Maaaartin/adb-ts/blob/5393493/src/util/errors.ts#L32)
