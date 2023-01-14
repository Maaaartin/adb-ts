## API

Start by importing [`AdbClient`](./classes/AdbClient.AdbClient.html).

```ts
import { AdbClient } from 'adb-ts';
const adb = new AdbClient();
const statuses = await adb.map((device) => {
    return device.batteryStatus();
});
```

In order to start adb server automatically path to adb must be specified.

```ts
import { AdbClient } from 'adb-ts';
const adb = new AdbClient({ bin: '/path/to/adb' });
// ...
```

## Examples

For operations on all connected device `map` method can be used.
In the callback an instance of [`AdbDevice`](./classes/AdbDevice.AdbDevice.html) comes as input parameter.

```ts
const packages = await Promise.all([
    adb.map(async (device) => {
        await device.uninstall('con.example.app');
        await device.install('/path/to/app.apk', { test: true });
        return device.listPackages();
    })
]);
console.log(packages);
```

Part of this module is also a [`Logcat`](./classes/Logcat.LogcatReader.html) client...

```ts
const logcat = await adb.openLogcat('serial', {
    filter: (entry) => entry.message.includes('test')
});
logcat.on('entry', (entry) => {
    console.log(entry);
});
// logcat.end();
```

and [`Monkey`](./classes/Monkey.Monkey.html) client.

```ts
const monkey = await adb.openMonkey('serial');

monkey.getBuildBoard((err, value) => {
    console.log('getBuildBoard', err, value);
});
// monkey.end();
```

In addition to `map` method, there is tracking function via [`Tracker`](./classes/Tracker.Tracker.html).

```ts
const tracker = await adb.trackDevices();
tracker.on('add', (device) => {
    console.log('add', device);
});
tracker.on('remove', (device) => {
    console.log('remove', device);
});
tracker.on('change', (device) => {
    console.log('change', device);
});
// tracker.end();
```

Every `AdbClient` method has an overload with callback parameter.

```ts
const devices = await adb.listDevices();
console.log(devices);

adb.listDevices((devices) => {
    console.log(devices);
});
```
