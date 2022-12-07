import Monkey from '../../lib/monkey/client';

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