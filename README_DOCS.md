## API

Start by importing `AdbClient`.

```ts
import { AdbClient } from 'adb-ts';
const adb = new AdbClient();
const statuses = await adb.map((device) => {
    return device.batteryStatus();
});
```
