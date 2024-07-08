[adb-ts](../README.md) / [Exports](../modules.md) / [Monkey](../modules/Monkey.md) / ParsableCommand

# Class: ParsableCommand<T\>

[Monkey](../modules/Monkey.md).ParsableCommand

## Type parameters

| Name |
| :--- |
| `T`  |

## Hierarchy

-   [`BaseCommand`](Monkey.BaseCommand.md)<`T`\>

    ↳ **`ParsableCommand`**

## Table of contents

### Constructors

-   [constructor](Monkey.ParsableCommand.md#constructor)

### Properties

-   [callback](Monkey.ParsableCommand.md#callback)
-   [command](Monkey.ParsableCommand.md#command)
-   [parser](Monkey.ParsableCommand.md#parser)

### Methods

-   [isParsable](Monkey.ParsableCommand.md#isparsable)

## Constructors

### constructor

• **new ParsableCommand**<`T`\>(`command`, `callback`, `parser`)

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name       | Type                                                        |
| :--------- | :---------------------------------------------------------- |
| `command`  | `string`                                                    |
| `callback` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`T`\> |
| `parser`   | (`data`: `null` \| `string`) => `T`                         |

#### Overrides

[BaseCommand](Monkey.BaseCommand.md).[constructor](Monkey.BaseCommand.md#constructor)

#### Defined in

[src/monkey/command.ts:24](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/command.ts#L24)

## Properties

### callback

• `Readonly` **callback**: [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`T`\>

#### Inherited from

[BaseCommand](Monkey.BaseCommand.md).[callback](Monkey.BaseCommand.md#callback)

#### Defined in

[src/monkey/command.ts:5](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/command.ts#L5)

---

### command

• `Readonly` **command**: `string`

#### Inherited from

[BaseCommand](Monkey.BaseCommand.md).[command](Monkey.BaseCommand.md#command)

#### Defined in

[src/monkey/command.ts:4](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/command.ts#L4)

---

### parser

• `Readonly` **parser**: (`data`: `null` \| `string`) => `T`

#### Type declaration

▸ (`data`): `T`

##### Parameters

| Name   | Type               |
| :----- | :----------------- |
| `data` | `null` \| `string` |

##### Returns

`T`

#### Defined in

[src/monkey/command.ts:23](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/command.ts#L23)

## Methods

### isParsable

▸ **isParsable**(): this is ParsableCommand<T\>

#### Returns

this is ParsableCommand<T\>

#### Overrides

[BaseCommand](Monkey.BaseCommand.md).[isParsable](Monkey.BaseCommand.md#isparsable)

#### Defined in

[src/monkey/command.ts:20](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/command.ts#L20)
