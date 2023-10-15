[adb-ts](../README.md) / [Exports](../modules.md) / [Monkey](../modules/Monkey.md) / Command

# Class: Command

[Monkey](../modules/Monkey.md).Command

## Hierarchy

- [`BaseCommand`](Monkey.BaseCommand.md)<``null``\>

  ↳ **`Command`**

## Table of contents

### Constructors

- [constructor](Monkey.Command.md#constructor)

### Properties

- [callback](Monkey.Command.md#callback)
- [command](Monkey.Command.md#command)

### Methods

- [isParsable](Monkey.Command.md#isparsable)

## Constructors

### constructor

• **new Command**(`command`, `callback`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | `string` |
| `callback` | [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null``\> |

#### Inherited from

[BaseCommand](Monkey.BaseCommand.md).[constructor](Monkey.BaseCommand.md#constructor)

#### Defined in

[src/monkey/command.ts:6](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/command.ts#L6)

## Properties

### callback

• `Readonly` **callback**: [`MonkeyCallback`](../modules/Util.md#monkeycallback)<``null``\>

#### Inherited from

[BaseCommand](Monkey.BaseCommand.md).[callback](Monkey.BaseCommand.md#callback)

#### Defined in

[src/monkey/command.ts:5](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/command.ts#L5)

___

### command

• `Readonly` **command**: `string`

#### Inherited from

[BaseCommand](Monkey.BaseCommand.md).[command](Monkey.BaseCommand.md#command)

#### Defined in

[src/monkey/command.ts:4](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/command.ts#L4)

## Methods

### isParsable

▸ **isParsable**(): this is ParsableCommand<null\>

#### Returns

this is ParsableCommand<null\>

#### Overrides

[BaseCommand](Monkey.BaseCommand.md).[isParsable](Monkey.BaseCommand.md#isparsable)

#### Defined in

[src/monkey/command.ts:14](https://github.com/Maaaartin/adb-ts/blob/5393493/src/monkey/command.ts#L14)
