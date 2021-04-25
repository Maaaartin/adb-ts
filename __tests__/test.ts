import { AdbClient } from '../lib/index';
const serial = process.env.SERIAL;

const adb = new AdbClient();
test('list devices', () => {
  expect(adb.listDevices()).resolves.toHaveProperty('length', 1);
});

test('version', async () => {
  const tmp = await adb.version();
  expect(tmp).toEqual(29);
});

test('features', () => {
  adb.map(async (d) => {
    const exp = await d.listFeatures().then((res) => {
      return JSON.stringify(res);
    });
    expect(exp).toContain('reqGlEsVersion');
  });
});

test('getdevicepath', () => {
  adb.map(async (d) => {
    const exp = await d.getDevicePath().then((res) => {
      return res;
    });
    expect(exp).toContain('unknown');
  });
});

test('forward', () => {
  adb.map(async (d) => {
    const exp = await d
      .forward('tcp:9222', 'localabstract:chrome_devtools_remote')
      .then((res) => {
        return d.listForwards().then((res) => {
          return res[0].serial;
        });
      });
    expect(exp).toContain(serial);
  });
});

test('property', () => {
  adb.map(async (d) => {
    const exp = await d.setProp('debug.enable', false).then(() => {
      return d.getProp('debug.enable').then((r) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(r);
          }, 2000);
        });
      });
    });
    expect(exp).toEqual(false);
  });
});

test('setting', () => {
  adb.map(async (d) => {
    const exp = await d.putSetting('system', 'volume_system', 4).then(() => {
      return d.getSetting('system', 'volume_system').then((r) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(r);
          }, 2000);
        });
      });
    });
    expect(exp).toEqual(4);
  });
});

test('file system', () => {
  adb.map(async (d) => {
    await d.mkdir('/sdcard/dir');
    await d.touch('/sdcard/file');
    await d.mv('/sdcard/file', '/sdcard/dir');
    await d.cp('/sdcard/dir/file', '/sdcard/file');
    await d.rm('/sdcard/file');
    const exp = await d
      .rm('/sdcard/dir', { recursive: true })
      .catch(() => null);
    expect(exp).toBe('');
  });
});
