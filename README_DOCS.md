## API

Start by importing [`Client`](./classes/Client.Client.html).

```ts
import { Client } from 'adb-ts';
const adb = new Client();
const statuses = await adb.map((device) => {
    return device.batteryStatus();
});
```

In order to start adb server automatically `adb` must be globally accessible or path to `adb` binary must be specified.

```ts
import { Client } from 'adb-ts';
const adb = new Client({ bin: '/path/to/adb' });
// ...
```

## Examples

For operations on all connected device `map` method can be used.
In the callback an instance of [`Device`](./classes/Device.Device.html) comes as input parameter.

```ts
const packages = await Promise.all(
    adb.map(async (device) => {
        await device.uninstall('con.example.app');
        await device.install('/path/to/app.apk', { test: true });
        return device.listPackages();
    })
);
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

Every `Client` method has an overload with callback parameter.

```ts
const devices = await adb.listDevices();
console.log(devices);

adb.listDevices((devices) => {
    console.log(devices);
});
```

## Changes from V5

-   `time` option in `touch` method is converted to UTC time.
-   Tracker `change` event emits the same instance of the device instead of creating a new device object every time.
-   `install` and `uninstall` commands will fail if any other response than `Success` is received. Until V5 the promise could have resolved even when the operation was not successful.

## Change log

### 6.1

`exec` methods accept `string[]` as an argument. Fix for https://github.com/Maaaartin/adb-ts/issues/13.

### 6.2

`PropertyMap` values do not contain `Date` type. This is because parsing date is tricky https://github.com/Maaaartin/adb-ts/issues/15.
`listFeatures` types are determined from `getprop -T` command. Types returned from this method are `number | boolean | string`.
