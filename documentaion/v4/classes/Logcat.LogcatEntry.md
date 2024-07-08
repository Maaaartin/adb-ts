[adb-ts](../README.md) / [Exports](../modules.md) / [Logcat](../modules/Logcat.md) / LogcatEntry

# Class: LogcatEntry

[Logcat](../modules/Logcat.md).LogcatEntry

## Table of contents

### Constructors

-   [constructor](Logcat.LogcatEntry.md#constructor)

### Properties

-   [date](Logcat.LogcatEntry.md#date)
-   [message](Logcat.LogcatEntry.md#message)
-   [pid](Logcat.LogcatEntry.md#pid)
-   [priority](Logcat.LogcatEntry.md#priority)
-   [tag](Logcat.LogcatEntry.md#tag)
-   [tid](Logcat.LogcatEntry.md#tid)

### Methods

-   [toBinary](Logcat.LogcatEntry.md#tobinary)

## Constructors

### constructor

• **new LogcatEntry**()

## Properties

### date

• **date**: `Date`

#### Defined in

[src/logcat/entry.ts:4](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/entry.ts#L4)

---

### message

• **message**: `string` = `''`

#### Defined in

[src/logcat/entry.ts:9](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/entry.ts#L9)

---

### pid

• **pid**: `number` = `-1`

#### Defined in

[src/logcat/entry.ts:5](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/entry.ts#L5)

---

### priority

• **priority**: [`Priority`](../enums/Logcat.Priority.md) = `Priority.SILENT`

#### Defined in

[src/logcat/entry.ts:7](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/entry.ts#L7)

---

### tag

• **tag**: `string` = `''`

#### Defined in

[src/logcat/entry.ts:8](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/entry.ts#L8)

---

### tid

• **tid**: `number` = `-1`

#### Defined in

[src/logcat/entry.ts:6](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/entry.ts#L6)

## Methods

### toBinary

▸ **toBinary**(): `Buffer`

#### Returns

`Buffer`

#### Defined in

[src/logcat/entry.ts:11](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/entry.ts#L11)
