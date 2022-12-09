// @ts-nocheck
import Monkey from '../../lib/monkey/client';
import { OkReply, ErrReply } from '../../lib/monkey/reply';
import MonkeyMock from '../../mockery/mockMonkey';

const getApiMethods = (obj: any): string[] => {
    if (obj === null) {
        throw new Error('No methods found');
    }
    if (obj.constructor.name === 'Api') {
        const parentMethods = new Set(
            Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
        );
        return Object.getOwnPropertyNames(obj).filter(
            (method) => !parentMethods.has(method)
        );
    }
    return getApiMethods(Object.getPrototypeOf(obj));
};

const voidMethods = {
    keyDown: { cmd: 'key down', params: [4] },
    keyUp: { cmd: 'key up', params: [4] },
    touchDown: { cmd: 'touch down', params: [4, 3] },
    touchUp: { cmd: 'touch up', params: [4, 3] },
    touchMove: { cmd: 'touch move', params: [4, 3] },
    trackball: { cmd: 'trackball', params: [4, 3] },
    flipOpen: { cmd: 'flip open', params: null },
    flipClose: { cmd: 'flip close', params: null },
    wake: { cmd: 'wake', params: null },
    tap: { cmd: 'tap', params: [3, 4] },
    press: { cmd: 'press', params: [3] },
    // TODO type with quotes
    type: { cmd: 'type', params: ['test'] },
    // list: {},
    // get: {},
    sleep: { cmd: 'sleep', params: [5] },
    quit: { cmd: 'quit', params: null },
    done: { cmd: 'done', params: null }
    // getAmCurrentAction: {},
    // getAmCurrentCategories: {},
    // getAmCurrentCompClass: {},
    // getAmCurrentCompPackage: {},
    // getAmCurrentData: {},
    // getAmCurrentPackage: {},
    // getBuildBoard: {},
    // getBuildBrand: {},
    // getBuildCpuAbi: {},
    // getBuildDevice: {},
    // getBuildDisplay: {},
    // getBuildFingerprint: {},
    // getBuildHost: {},
    // getBuildId: {},
    // getBuildManufacturer: {},
    // getBuildModel: {},
    // getBuildProduct: {},
    // getBuildTags: {},
    // getBuildType: {},
    // getBuildUser: {},
    // getBuildVersionCodename: {},
    // getBuildVersionIncremental: {},
    // getBuildVersionRelease: {},
    // getBuildVersionSdk: {},
    // getClockMillis: {},
    // getClockRealtime: {},
    // getClockUptime: {},
    // getDisplayDensity: {},
    // getDisplayHeight: {},
    // getDisplayWidth: {}
};

describe('Void OK tests', () => {
    Object.entries(voidMethods).forEach(([method, { cmd, params }]) => {
        it(`Should execute ${method} without error`, (done) => {
            const monkey = new MonkeyMock(new OkReply(null));
            const cb = (err: Error | null, reply: any, command: string) => {
                expect(err).toBeNull();
                expect(reply).toBeNull();
                expect(command).toEqual(
                    params ? `${cmd} ${params.join(' ')}` : cmd
                );
                done();
            };
            if (params) {
                monkey[method](...params, cb);
            } else {
                monkey[method](cb);
            }
        });
    });
});

describe('Void Error tests', () => {
    Object.entries(voidMethods).forEach(([method, { cmd, params }]) => {
        it(`Should execute ${method} with error`, (done) => {
            const monkey = new MonkeyMock(new ErrReply('error'));
            const cb = (err: Error | null, reply: any, command: string) => {
                expect(err).toEqual(new Error('error'));
                expect(reply).toBeNull();
                expect(command).toEqual(
                    params ? `${cmd} ${params.join(' ')}` : cmd
                );
                done();
            };

            if (params) {
                monkey[method](...params, cb);
            } else {
                monkey[method](cb);
            }
        });
    });
});
