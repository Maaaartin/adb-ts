import { EventEmitter } from 'events';
import { KeyCode } from '../keycode';
import { MonkeyCallback } from '..';

// reference https://android.googlesource.com/platform/development/+/master/cmds/monkey/src/com/android/commands/monkey/MonkeySourceNetworkVars.java
export default abstract class Api extends EventEmitter {
    public abstract send(
        commands: string[] | string,
        cb?: MonkeyCallback
    ): this;
    public abstract sendAndParse<T>(
        commands: string[] | string,
        cb?: MonkeyCallback<T>,
        parser?: (data: string | null) => T
    ): this;
    // TODO types for emitter
    keyDown(keyCode: KeyCode | number, cb?: MonkeyCallback): this {
        return this.send('key down ' + keyCode, cb);
    }

    keyUp(keyCode: KeyCode | number, cb?: MonkeyCallback): this {
        return this.send('key up ' + keyCode, cb);
    }

    touchDown(x: number, y: number, cb?: MonkeyCallback): this {
        return this.send('touch down ' + x + ' ' + y, cb);
    }

    touchUp(x: number, y: number, cb?: MonkeyCallback): this {
        return this.send('touch up ' + x + ' ' + y, cb);
    }

    touchMove(x: number, y: number, cb?: MonkeyCallback): this {
        return this.send('touch move ' + x + ' ' + y, cb);
    }

    trackball(dx: number, dy: number, cb?: MonkeyCallback): this {
        return this.send('trackball ' + dx + ' ' + dy, cb);
    }

    flipOpen(cb?: MonkeyCallback): this {
        return this.send('flip open', cb);
    }

    flipClose(cb?: MonkeyCallback): this {
        return this.send('flip close', cb);
    }

    wake(cb?: MonkeyCallback): this {
        return this.send('wake', cb);
    }

    tap(x: number, y: number, cb?: MonkeyCallback): this {
        return this.send('tap ' + x + ' ' + y, cb);
    }

    press(keyCode: KeyCode | number, cb?: MonkeyCallback): this {
        return this.send('press ' + keyCode, cb);
    }

    type(str: string, cb?: MonkeyCallback): this {
        str = str.replace(/"/g, '\\"');
        if (str.indexOf(' ') === -1) {
            return this.send('type ' + str, cb);
        } else {
            return this.send('type "' + str + '"', cb);
        }
    }

    list(cb?: MonkeyCallback<string[] | null>): this {
        const cmd = 'listvar';
        return this.sendAndParse(cmd, cb, (vars) => {
            return vars?.trim().split(/\s+/g) || null;
        });
    }

    get(name: string, cb?: MonkeyCallback<any>): this {
        return this.send('getvar ' + name, cb);
    }

    sleep(ms: number, cb?: MonkeyCallback): this {
        return this.send('sleep ' + ms, cb);
    }

    quit(cb?: MonkeyCallback): this {
        return this.send('quit', cb);
    }

    done(cb?: MonkeyCallback): this {
        return this.send('done', cb);
    }

    // am.  note that the current activity information isn't valid
    // until the first activity gets launched after the monkey has
    // been started.
    getAmCurrentAction(cb?: MonkeyCallback<string | null>): this {
        return this.get('am.current.action', cb);
    }

    getAmCurrentCategories(cb?: MonkeyCallback<string[] | null>): this {
        return this.sendAndParse('am.current.categories', cb, (cat) => {
            return cat?.trim().split(/\s+/g) || null;
        });
    }

    getAmCurrentCompClass(cb?: MonkeyCallback<string | null>): this {
        return this.get('am.current.comp.class', cb);
    }

    getAmCurrentCompPackage(cb?: MonkeyCallback<string | null>): this {
        return this.get('am.current.comp.package', cb);
    }

    getAmCurrentData(cb?: MonkeyCallback<string | null>): this {
        return this.get('am.current.data', cb);
    }

    getAmCurrentPackage(cb?: MonkeyCallback<string | null>): this {
        return this.get('am.current.package', cb);
    }

    getBuildBoard(cb?: MonkeyCallback): this {
        return this.get('build.board', cb);
    }

    getBuildBrand(cb?: MonkeyCallback): this {
        return this.get('build.brand', cb);
    }

    getBuildCpuAbi(cb?: MonkeyCallback): this {
        return this.get('build.cpu_abi', cb);
    }

    getBuildDevice(cb?: MonkeyCallback): this {
        return this.get('build.device', cb);
    }

    getBuildDisplay(cb?: MonkeyCallback): this {
        return this.get('build.display', cb);
    }

    getBuildFingerprint(cb?: MonkeyCallback): this {
        return this.get('build.fingerprint', cb);
    }

    getBuildHost(cb?: MonkeyCallback): this {
        return this.get('build.host', cb);
    }

    getBuildId(cb?: MonkeyCallback): this {
        return this.get('build.id', cb);
    }

    getBuildManufacturer(cb?: MonkeyCallback): this {
        return this.get('build.manufacturer', cb);
    }

    getBuildModel(cb?: MonkeyCallback): this {
        return this.get('build.model', cb);
    }

    getBuildProduct(cb?: MonkeyCallback): this {
        return this.get('build.product', cb);
    }

    getBuildTags(cb?: MonkeyCallback): this {
        return this.get('build.tags', cb);
    }

    getBuildType(cb?: MonkeyCallback): this {
        return this.get('build.type', cb);
    }

    getBuildUser(cb?: MonkeyCallback): this {
        return this.get('build.user', cb);
    }

    getBuildVersionCodename(cb?: MonkeyCallback): this {
        return this.get('build.version.codename', cb);
    }

    getBuildVersionIncremental(cb?: MonkeyCallback): this {
        return this.get('build.version.incremental', cb);
    }

    getBuildVersionRelease(cb?: MonkeyCallback): this {
        return this.get('build.version.release', cb);
    }

    getBuildVersionSdk(cb?: MonkeyCallback): this {
        return this.get('build.version.sdk', cb);
    }

    getClockMillis(cb?: MonkeyCallback): this {
        return this.get('clock.millis', cb);
    }

    getClockRealtime(cb?: MonkeyCallback): this {
        return this.get('clock.realtime', cb);
    }

    getClockUptime(cb?: MonkeyCallback): this {
        return this.get('clock.uptime', cb);
    }

    getDisplayDensity(cb?: MonkeyCallback): this {
        return this.get('display.density', cb);
    }

    getDisplayHeight(cb?: MonkeyCallback): this {
        return this.get('display.height', cb);
    }

    getDisplayWidth(cb?: MonkeyCallback): this {
        return this.get('display.width', cb);
    }
}
