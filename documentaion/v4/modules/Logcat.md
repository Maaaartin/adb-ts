[adb-ts](../README.md) / [Exports](../modules.md) / Logcat

# Namespace: Logcat

## Table of contents

### Enumerations

- [Priority](../enums/Logcat.Priority.md)

### Classes

- [Binary](../classes/Logcat.Binary.md)
- [LogcatEntry](../classes/Logcat.LogcatEntry.md)
- [LogcatReader](../classes/Logcat.LogcatReader.md)
- [Parser](../classes/Logcat.Parser.md)

### Functions

- [readStream](Logcat.md#readstream)

## Functions

### readStream

▸ **readStream**(`stream`, `options`): [`LogcatReader`](../classes/Logcat.LogcatReader.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | `Writable` |
| `options` | [`LogcatReaderOptions`](Util.md#logcatreaderoptions) |

#### Returns

[`LogcatReader`](../classes/Logcat.LogcatReader.md)

#### Defined in

[src/logcat/index.ts:11](https://github.com/Maaaartin/adb-ts/blob/5393493/src/logcat/index.ts#L11)
