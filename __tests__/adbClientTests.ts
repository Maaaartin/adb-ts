import AdbClient from '../lib/client.js';

test('Create Adb client instance', () => {
    const client = new AdbClient();
    expect(client.options).toEqual({
        port: 5037,
        host: 'localhost',
        bin: 'adb',
        noAutoStart: false
    });
});
