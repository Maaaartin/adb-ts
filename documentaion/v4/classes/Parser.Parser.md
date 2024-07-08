[adb-ts](../README.md) / [Exports](../modules.md) / [Parser](../modules/Parser.md) / Parser

# Class: Parser

[Parser](../modules/Parser.md).Parser

## Table of contents

### Constructors

-   [constructor](Parser.Parser.md#constructor)

### Properties

-   [ended](Parser.Parser.md#ended)
-   [socket](Parser.Parser.md#socket)

### Methods

-   [end](Parser.Parser.md#end)
-   [readAll](Parser.Parser.md#readall)
-   [readAscii](Parser.Parser.md#readascii)
-   [readByteFlow](Parser.Parser.md#readbyteflow)
-   [readBytes](Parser.Parser.md#readbytes)
-   [readError](Parser.Parser.md#readerror)
-   [readUntil](Parser.Parser.md#readuntil)
-   [readValue](Parser.Parser.md#readvalue)
-   [readline](Parser.Parser.md#readline)
-   [searchLine](Parser.Parser.md#searchline)
-   [unexpected](Parser.Parser.md#unexpected)

## Constructors

### constructor

• **new Parser**(`socket`)

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `socket` | `Socket` |

#### Defined in

[src/parser.ts:11](https://github.com/Maaaartin/adb-ts/blob/5393493/src/parser.ts#L11)

## Properties

### ended

• `Private` **ended**: `boolean` = `false`

#### Defined in

[src/parser.ts:10](https://github.com/Maaaartin/adb-ts/blob/5393493/src/parser.ts#L10)

---

### socket

• `Readonly` **socket**: `Socket`

#### Defined in

[src/parser.ts:9](https://github.com/Maaaartin/adb-ts/blob/5393493/src/parser.ts#L9)

## Methods

### end

▸ **end**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[src/parser.ts:50](https://github.com/Maaaartin/adb-ts/blob/5393493/src/parser.ts#L50)

---

### readAll

▸ **readAll**(): `Promise`<`Buffer`\>

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[src/parser.ts:175](https://github.com/Maaaartin/adb-ts/blob/5393493/src/parser.ts#L175)

---

### readAscii

▸ **readAscii**(`howMany`): `Promise`<`string`\>

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `howMany` | `number` |

#### Returns

`Promise`<`string`\>

#### Defined in

[src/parser.ts:76](https://github.com/Maaaartin/adb-ts/blob/5393493/src/parser.ts#L76)

---

### readByteFlow

▸ **readByteFlow**(`howMany`, `targetStream`): `Promise`<`void`\>

#### Parameters

| Name           | Type       |
| :------------- | :--------- |
| `howMany`      | `number`   |
| `targetStream` | `Writable` |

#### Returns

`Promise`<`void`\>

#### Defined in

[src/parser.ts:99](https://github.com/Maaaartin/adb-ts/blob/5393493/src/parser.ts#L99)

---

### readBytes

▸ **readBytes**(`howMany`): `Promise`<`Buffer`\>

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `howMany` | `number` |

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[src/parser.ts:14](https://github.com/Maaaartin/adb-ts/blob/5393493/src/parser.ts#L14)

---

### readError

▸ **readError**(): `Promise`<`Error`\>

#### Returns

`Promise`<`Error`\>

#### Defined in

[src/parser.ts:86](https://github.com/Maaaartin/adb-ts/blob/5393493/src/parser.ts#L86)

---

### readUntil

▸ `Private` **readUntil**(`code`): `Promise`<`Buffer`\>

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `code` | `number` |

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[src/parser.ts:141](https://github.com/Maaaartin/adb-ts/blob/5393493/src/parser.ts#L141)

---

### readValue

▸ **readValue**(): `Promise`<`Buffer`\>

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[src/parser.ts:80](https://github.com/Maaaartin/adb-ts/blob/5393493/src/parser.ts#L80)

---

### readline

▸ `Private` **readline**(): `Promise`<`Buffer`\>

#### Returns

`Promise`<`Buffer`\>

#### Defined in

[src/parser.ts:152](https://github.com/Maaaartin/adb-ts/blob/5393493/src/parser.ts#L152)

---

### searchLine

▸ **searchLine**(`regExp`, `retry?`): `Promise`<`RegExpExecArray`\>

#### Parameters

| Name     | Type      | Default value |
| :------- | :-------- | :------------ |
| `regExp` | `RegExp`  | `undefined`   |
| `retry`  | `boolean` | `true`        |

#### Returns

`Promise`<`RegExpExecArray`\>

#### Defined in

[src/parser.ts:160](https://github.com/Maaaartin/adb-ts/blob/5393493/src/parser.ts#L160)

---

### unexpected

▸ **unexpected**(`data`, `expected`): [`UnexpectedDataError`](Util.UnexpectedDataError.md)

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `data`     | `string` |
| `expected` | `string` |

#### Returns

[`UnexpectedDataError`](Util.UnexpectedDataError.md)

#### Defined in

[src/parser.ts:95](https://github.com/Maaaartin/adb-ts/blob/5393493/src/parser.ts#L95)
