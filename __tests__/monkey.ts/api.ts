// @ts-nocheck

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
    type: { cmd: 'type', params: ['test'] },
    sleep: { cmd: 'sleep', params: [5] },
    quit: { cmd: 'quit', params: null },
    done: { cmd: 'done', params: null }
};

const specialCaseMethods = {
    // type with quotes
    type: {
        cmd: 'type',
        params: ['"test"'],
        response: null,
        escaped: 'type \\"test\\"'
    },
    list: {
        cmd: 'listvar',
        params: null,
        response: 'var1 var2',
        parsed: ['var1', 'var2']
    },
    get: { cmd: 'getvar', params: ['test'], response: 'value' }
};

const amMethods = {
    getAmCurrentAction: {
        cmd: 'getvar am.current.action',
        response: 'action'
    },
    getAmCurrentCategories: {
        cmd: 'getvar am.current.categories',
        response: 'cat1 cat2',
        parsed: ['cat1', 'cat2']
    },
    getAmCurrentCompClass: {
        cmd: 'getvar am.current.comp.class',
        response: 'class'
    },
    getAmCurrentCompPackage: {
        cmd: 'getvar am.current.comp.package',
        response: 'package'
    },
    getAmCurrentData: { cmd: 'getvar am.current.data', response: 'data' },
    getAmCurrentPackage: {
        cmd: 'getvar am.current.package',
        response: 'package'
    }
};

const buildMethods = {
    getBuildBoard: { cmd: 'getvar build.board', response: 'board' },
    getBuildBrand: { cmd: 'getvar build.brand', response: 'brand' },
    getBuildCpuAbi: { cmd: 'getvar build.cpu_abi', xx: 'board' },
    getBuildDevice: { cmd: 'getvar build.device', response: 'device' },
    getBuildDisplay: { cmd: 'getvar build.display', response: 'display' },
    getBuildFingerprint: { cmd: 'getvar build.fingerprint', response: 'print' },
    getBuildHost: { cmd: 'getvar build.host', response: 'host' },
    getBuildId: { cmd: 'getvar build.id', response: 'id' },
    getBuildManufacturer: {
        cmd: 'getvar build.manufacturer',
        response: 'manufacturer'
    },
    getBuildModel: { cmd: 'getvar build.model', response: 'model' },
    getBuildProduct: { cmd: 'getvar build.product', response: 'product' },
    getBuildTags: {
        cmd: 'getvar build.tags',
        response: 'tag1,tag2',
        parsed: ['tag1', 'tag2']
    },
    getBuildType: { cmd: 'getvar build.type', response: 'type' },
    getBuildUser: { cmd: 'getvar build.user', response: 'user' },
    getBuildVersionCodename: {
        cmd: 'getvar build.version.codename',
        response: 'codename'
    },
    getBuildVersionIncremental: {
        cmd: 'getvar build.version.incremental',
        response: 'incremental'
    },
    getBuildVersionRelease: {
        cmd: 'getvar build.version.release',
        response: '13'
    },
    getBuildVersionSdk: {
        cmd: 'getvar build.version.sdk',
        response: '5',
        parsed: 5
    }
};

const clockMethods = {
    getClockMillis: {
        cmd: 'getvar clock.millis',
        response: '1234',
        parsed: 1234
    },
    getClockRealtime: {
        cmd: 'getvar clock.realtime',
        response: '1234',
        parsed: 1234
    },
    getClockUptime: {
        cmd: 'getvar clock.uptime',
        response: '1234',
        parsed: 1234
    }
};

const displayMethods = {
    getDisplayDensity: {
        cmd: 'getvar display.density',
        response: '1.125',
        parsed: 1.125
    },
    getDisplayHeight: {
        cmd: 'getvar display.height',
        response: '1234',
        parsed: 1234
    },
    getDisplayWidth: {
        cmd: 'getvar display.width',
        response: '1234',
        parsed: 1234
    }
};

const runVoidTests = (methods: Record<string, any>) => {
    describe('Void OK tests', () => {
        Object.entries(methods).forEach(([method, { cmd, params }]) => {
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
        Object.entries(methods).forEach(([method, { cmd, params }]) => {
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
};

const runSpecialCaseMethods = (methods: Record<string, any>) => {
    describe('Special case OK tests', () => {
        Object.entries(methods).forEach(
            ([method, { cmd, params, response, parsed, escaped }]) => {
                it(`Should execute ${method} without error`, (done) => {
                    const monkey = new MonkeyMock(new OkReply(response));
                    const cb = (
                        err: Error | null,
                        reply: any,
                        command: string
                    ) => {
                        expect(err).toBeNull();
                        expect(reply).toEqual(parsed || response);
                        expect(command).toEqual(
                            escaped ||
                                (params ? `${cmd} ${params.join(' ')}` : cmd)
                        );
                        done();
                    };
                    if (params) {
                        monkey[method](...params, cb);
                    } else {
                        monkey[method](cb);
                    }
                });
            }
        );
    });

    describe('Special case Error tests', () => {
        Object.entries(methods).forEach(
            ([method, { cmd, params, escaped }]) => {
                it(`Should execute ${method} with error`, (done) => {
                    const monkey = new MonkeyMock(new ErrReply('error'));
                    const cb = (
                        err: Error | null,
                        reply: any,
                        command: string
                    ) => {
                        expect(err).toEqual(new Error('error'));
                        expect(reply).toBeNull();
                        expect(command).toEqual(
                            escaped ||
                                (params ? `${cmd} ${params.join(' ')}` : cmd)
                        );
                        done();
                    };

                    if (params) {
                        monkey[method](...params, cb);
                    } else {
                        monkey[method](cb);
                    }
                });
            }
        );
    });
};

const runSubcommandTests = (name: string, methods: Record<string, any>) => {
    describe(`Am ${name} tests`, () => {
        Object.entries(methods).forEach(
            ([method, { cmd, response, parsed }]) => {
                it(`Should execute ${method} without error`, (done) => {
                    const monkey = new MonkeyMock(new OkReply(response));
                    const cb = (
                        err: Error | null,
                        reply: any,
                        command: string
                    ) => {
                        expect(err).toBeNull();
                        expect(reply).toEqual(parsed || response);
                        expect(command).toEqual(cmd);
                        done();
                    };

                    monkey[method](cb);
                });
            }
        );
    });

    describe('Am Error tests', () => {
        Object.entries(amMethods).forEach(([method, { cmd }]) => {
            it(`Should execute ${method} with error`, (done) => {
                const monkey = new MonkeyMock(new ErrReply('error'));
                const cb = (err: Error | null, reply: any, command: string) => {
                    expect(err).toEqual(new Error('error'));
                    expect(reply).toBeNull();
                    expect(command).toEqual(cmd);
                    done();
                };

                monkey[method](cb);
            });
        });
    });
};

runVoidTests(voidMethods);

runSpecialCaseMethods(specialCaseMethods);

runSubcommandTests('Am', amMethods);
runSubcommandTests('Build', buildMethods);
runSubcommandTests('Clock', clockMethods);
runSubcommandTests('Display', displayMethods);
