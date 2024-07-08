[adb-ts](../README.md) / [Exports](../modules.md) / [Monkey](../modules/Monkey.md) / BaseCommand

# Class: BaseCommand<T\>

[Monkey](../modules/Monkey.md).BaseCommand

## Type parameters

| Name |
| :--- |
| `T`  |

## Hierarchy

-   **`BaseCommand`**

    ↳ [`Command`](Monkey.Command.md)

    ↳ [`ParsableCommand`](Monkey.ParsableCommand.md)

## Table of contents

### Constructors

-   [constructor](Monkey.BaseCommand.md#constructor)

### Properties

-   [callback](Monkey.BaseCommand.md#callback)
-   [command](Monkey.BaseCommand.md#command)

### Methods

-   [isParsable](Monkey.BaseCommand.md#isparsable)

## Constructors

### constructor

• **new BaseCommand**<`T`\>(`command`, `callback`)

#### Type parameters

| Name |
| :--- |
| `T`  |

#### Parameters

| Name       | Type                                                        |
| :--------- | :---------------------------------------------------------- |
| `command`  | `string`                                                    |
| `callback` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`T`\> |

#### Defined in

[src/monkey/command.ts:6](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/command.ts#L6)

## Properties

### callback

• `Readonly` **callback**: [`MonkeyCallback`](../modules/Util.md#monkeycallback)<`T`\>

#### Defined in

[src/monkey/command.ts:5](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/command.ts#L5)

---

### command

• `Readonly` **command**: `string`

#### Defined in

[src/monkey/command.ts:4](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/command.ts#L4)

## Methods

### isParsable

▸ `Abstract` **isParsable**(): this is ParsableCommand<T\>

#### Returns

this is ParsableCommand<T\>

#### Defined in

[src/monkey/command.ts:10](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/command.ts#L10)
