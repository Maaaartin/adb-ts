import Monkey from '../../lib/monkey/client';
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

const expectedMethods = [
    'keyDown',
    'keyUp',
    'touchDown',
    'touchUp',
    'touchMove',
    'trackball',
    'flipOpen',
    'flipClose',
    'wake',
    'tap',
    'press',
    'type',
    'list',
    'get',
    'sleep',
    'quit',
    'done',
    'getAmCurrentAction',
    'getAmCurrentCategories',
    'getAmCurrentCompClass',
    'getAmCurrentCompPackage',
    'getAmCurrentData',
    'getAmCurrentPackage',
    'getBuildBoard',
    'getBuildBrand',
    'getBuildCpuAbi',
    'getBuildDevice',
    'getBuildDisplay',
    'getBuildFingerprint',
    'getBuildHost',
    'getBuildId',
    'getBuildManufacturer',
    'getBuildModel',
    'getBuildProduct',
    'getBuildTags',
    'getBuildType',
    'getBuildUser',
    'getBuildVersionCodename',
    'getBuildVersionIncremental',
    'getBuildVersionRelease',
    'getBuildVersionSdk',
    'getClockMillis',
    'getClockRealtime',
    'getClockUptime',
    'getDisplayDensity',
    'getDisplayHeight',
    'getDisplayWidth'
];

describe('Monkey command queue tests', () => {
    it('Should execute without error', () => {
        const monkey = new Monkey();

        expect(getApiMethods(monkey)).toEqual(expectedMethods);
    });
});

describe('Key up tests', () => {
    it('Should execute without error', (done) => {
        const monkey = new MonkeyMock({ status: 'OK', reply: null });
        monkey.keyUp(4, (err, reply, command) => {
            expect(err).toBeNull();
            expect(reply).toBeNull();
            expect(command).toEqual('key up 4');
            done();
        });
    });
});
