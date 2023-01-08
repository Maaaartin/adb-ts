# adb-ts

Module handling adb functionality, inspired by [adbkit](https://www.npmjs.com/package/adbkit), [adbkit-monkey](https://www.npmjs.com/package/adbkit-monkey) and [adbkit-logcat](https://www.npmjs.com/package/adbkit-logcat). This module removes its deprecated api, includes bug fixes, TS support and more convenient functions and syntax as well as easy scalability for custom functionalities.

## Installation

```bash
yarn add adb-ts
```

## API

Start by importing `AdbClient`.

```ts
import { AdbClient } from 'adb-ts';
const adb = new AdbClient();
```
