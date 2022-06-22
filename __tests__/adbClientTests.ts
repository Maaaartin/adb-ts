import { deepStrictEqual } from 'assert';
import { AdbClientOptionsValues } from '../src';
import AdbClient from '../src/client';

test('Create Adb client instance', () => {
    const client = new AdbClient();
    deepStrictEqual<AdbClientOptionsValues>(client.options, {
        port: 5037,
        host: 'localhost',
        bin: 'adb',
        noAutoStart: false
    });
});
