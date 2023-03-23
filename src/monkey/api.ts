import { EventEmitter } from 'events';
import { KeyCode } from '../util/keycode';
import { MonkeyCallback } from '../util';

// reference https://android.googlesource.com/platform/development/+/master/cmds/monkey/src/com/android/commands/monkey/MonkeySourceNetworkVars.java
export default abstract class Api extends EventEmitter {
    public abstract send(command: string, cb?: MonkeyCallback): this;
    public abstract sendAndParse<T>(
        command: string,
        cb?: MonkeyCallback<T>,
        parser?: (data: string | null) => T | null
    ): this;
    private getAndParse(
        command: string,
        parser: { type: 'number' },
        cb?: MonkeyCallback<number | null>
    ): this;
    private getAndParse(
        command: string,
        parser: {
            type: 'stringArray';
            splitter: string | RegExp;
        },
        cb?: MonkeyCallback<string[] | null>
    ): this;
    private getAndParse(
        command: string,
        parser:
            | {
                  type: 'stringArray';
                  splitter: string | RegExp;
              }
            | { type: 'number' },
        cb?: MonkeyCallback<number | null> | MonkeyCallback<string[] | null>
    ): this {
        return this.sendAndParse(
            'getvar ' + command,
            cb as MonkeyCallback<number | string[] | null>,
            (data) => {
                if (!data) {
                    return null;
                }
                if (parser.type === 'number') {
                    return parseFloat(data);
                }
                return data.split(parser.splitter);
            }
        );
    }

    public keyDown(keyCode: KeyCode | number, cb?: MonkeyCallback): this {
        return this.send('key down ' + keyCode, cb);
    }

    public keyUp(keyCode: KeyCode | number, cb?: MonkeyCallback): this {
        return this.send('key up ' + keyCode, cb);
    }

    public touchDown(x: number, y: number, cb?: MonkeyCallback): this {
        return this.send('touch down ' + x + ' ' + y, cb);
    }

    public touchUp(x: number, y: number, cb?: MonkeyCallback): this {
        return this.send('touch up ' + x + ' ' + y, cb);
    }

    public touchMove(x: number, y: number, cb?: MonkeyCallback): this {
        return this.send('touch move ' + x + ' ' + y, cb);
    }

    public trackball(dx: number, dy: number, cb?: MonkeyCallback): this {
        return this.send('trackball ' + dx + ' ' + dy, cb);
    }

    public flipOpen(cb?: MonkeyCallback): this {
        return this.send('flip open', cb);
    }

    public flipClose(cb?: MonkeyCallback): this {
        return this.send('flip close', cb);
    }

    public wake(cb?: MonkeyCallback): this {
        return this.send('wake', cb);
    }

    public tap(x: number, y: number, cb?: MonkeyCallback): this {
        return this.send('tap ' + x + ' ' + y, cb);
    }

    public press(keyCode: KeyCode | number, cb?: MonkeyCallback): this {
        return this.send('press ' + keyCode, cb);
    }

    public type(str: string, cb?: MonkeyCallback): this {
        str = str.replace(/"/g, '\\"');
        if (str.indexOf(' ') === -1) {
            return this.send('type ' + str, cb);
        } else {
            return this.send('type "' + str + '"', cb);
        }
    }

    public list(cb?: MonkeyCallback<string[] | null>): this {
        return this.sendAndParse('listvar', cb, (vars) => {
            return vars?.trim().split(/\s+/g) || null;
        });
    }

    public get(name: string, cb?: MonkeyCallback<string | null>): this {
        return this.send('getvar ' + name, cb);
    }

    public sleep(ms: number, cb?: MonkeyCallback): this {
        return this.send('sleep ' + ms, cb);
    }

    public quit(cb?: MonkeyCallback): this {
        return this.send('quit', cb);
    }

    public done(cb?: MonkeyCallback): this {
        return this.send('done', cb);
    }

    // am.  note that the current activity information isn't valid
    // until the first activity gets launched after the monkey has
    // been started.
    public getAmCurrentAction(cb?: MonkeyCallback<string | null>): this {
        return this.get('am.current.action', cb);
    }

    public getAmCurrentCategories(cb?: MonkeyCallback<string[] | null>): this {
        return this.getAndParse(
            'am.current.categories',
            { type: 'stringArray', splitter: /\s+/g },
            cb
        );
    }

    public getAmCurrentCompClass(cb?: MonkeyCallback<string | null>): this {
        return this.get('am.current.comp.class', cb);
    }

    public getAmCurrentCompPackage(cb?: MonkeyCallback<string | null>): this {
        return this.get('am.current.comp.package', cb);
    }

    public getAmCurrentData(cb?: MonkeyCallback<string | null>): this {
        return this.get('am.current.data', cb);
    }

    public getAmCurrentPackage(cb?: MonkeyCallback<string | null>): this {
        return this.get('am.current.package', cb);
    }

    public getBuildBoard(cb?: MonkeyCallback<string | null>): this {
        return this.get('build.board', cb);
    }

    public getBuildBrand(cb?: MonkeyCallback<string | null>): this {
        return this.get('build.brand', cb);
    }

    public getBuildCpuAbi(cb?: MonkeyCallback<string | null>): this {
        return this.get('build.cpu_abi', cb);
    }

    public getBuildDevice(cb?: MonkeyCallback<string | null>): this {
        return this.get('build.device', cb);
    }

    public getBuildDisplay(cb?: MonkeyCallback<string | null>): this {
        return this.get('build.display', cb);
    }

    public getBuildFingerprint(cb?: MonkeyCallback<string | null>): this {
        return this.get('build.fingerprint', cb);
    }

    public getBuildHost(cb?: MonkeyCallback<string | null>): this {
        return this.get('build.host', cb);
    }

    public getBuildId(cb?: MonkeyCallback<string | null>): this {
        return this.get('build.id', cb);
    }

    public getBuildManufacturer(cb?: MonkeyCallback<string | null>): this {
        return this.get('build.manufacturer', cb);
    }

    public getBuildModel(cb?: MonkeyCallback<string | null>): this {
        return this.get('build.model', cb);
    }

    public getBuildProduct(cb?: MonkeyCallback<string | null>): this {
        return this.get('build.product', cb);
    }

    public getBuildTags(cb?: MonkeyCallback<string[] | null>): this {
        return this.getAndParse(
            'build.tags',
            { type: 'stringArray', splitter: ',' },
            cb
        );
    }

    public getBuildType(cb?: MonkeyCallback<string | null>): this {
        return this.get('build.type', cb);
    }

    public getBuildUser(cb?: MonkeyCallback<string | null>): this {
        return this.get('build.user', cb);
    }

    public getBuildVersionCodename(cb?: MonkeyCallback<string | null>): this {
        return this.get('build.version.codename', cb);
    }

    public getBuildVersionIncremental(
        cb?: MonkeyCallback<string | null>
    ): this {
        return this.get('build.version.incremental', cb);
    }

    public getBuildVersionRelease(cb?: MonkeyCallback<string | null>): this {
        return this.get('build.version.release', cb);
    }

    public getBuildVersionSdk(cb?: MonkeyCallback<number | null>): this {
        return this.getAndParse('build.version.sdk', { type: 'number' }, cb);
    }

    public getClockMillis(cb?: MonkeyCallback<number | null>): this {
        return this.getAndParse('clock.millis', { type: 'number' }, cb);
    }

    public getClockRealtime(cb?: MonkeyCallback<number | null>): this {
        return this.getAndParse('clock.realtime', { type: 'number' }, cb);
    }

    public getClockUptime(cb?: MonkeyCallback<number | null>): this {
        return this.getAndParse('clock.uptime', { type: 'number' }, cb);
    }

    public getDisplayDensity(cb?: MonkeyCallback<number | null>): this {
        return this.getAndParse('display.density', { type: 'number' }, cb);
    }

    public getDisplayHeight(cb?: MonkeyCallback<number | null>): this {
        return this.getAndParse('display.height', { type: 'number' }, cb);
    }

    public getDisplayWidth(cb?: MonkeyCallback<number | null>): this {
        return this.getAndParse('display.width', { type: 'number' }, cb);
    }
}
