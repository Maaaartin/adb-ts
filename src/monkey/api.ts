import { EventEmitter } from 'events'
import { KeyCode } from '../keycode'
import { MonkeyCallback } from '..'

export default abstract class Api extends EventEmitter {
    public abstract send(commands: string[] | string, cb?: MonkeyCallback): this
    keyDown(keyCode: KeyCode | number, cb?: MonkeyCallback) {
        return this.send('key down ' + keyCode, cb)
    }

    keyUp(keyCode: KeyCode | number, cb?: MonkeyCallback) {
        return this.send('key up ' + keyCode, cb)
    }

    touchDown(x: number, y: number, cb?: MonkeyCallback) {
        return this.send('touch down ' + x + ' ' + y, cb)
    }

    touchUp(x: number, y: number, cb?: MonkeyCallback) {
        return this.send('touch up ' + x + ' ' + y, cb)
    }

    touchMove(x: number, y: number, cb?: MonkeyCallback) {
        return this.send('touch move ' + x + ' ' + y, cb)
    }

    trackball(dx: number, dy: number, cb?: MonkeyCallback) {
        return this.send('trackball ' + dx + ' ' + dy, cb)
    }

    flipOpen(cb?: MonkeyCallback) {
        return this.send('flip open', cb)
    }

    flipClose(cb?: MonkeyCallback) {
        return this.send('flip close', cb)
    }

    wake(cb?: MonkeyCallback) {
        return this.send('wake', cb)
    }

    tap(x: number, y: number, cb?: MonkeyCallback) {
        return this.send('tap ' + x + ' ' + y, cb)
    }

    press(keyCode: KeyCode | number, cb?: MonkeyCallback) {
        return this.send('press ' + keyCode, cb)
    }

    type(str: string, cb?: MonkeyCallback) {
        str = str.replace(/"/g, '\\"')
        if (str.indexOf(' ') === -1) {
            this.send('type ' + str, cb)
        } else {
            this.send('type "' + str + '"', cb)
        }
        return this
    }

    list(cb?: MonkeyCallback<string[]>) {
        return this.send('listvar', (err, vars) => {
            if (err) {
                return cb?.(err, null)
            }
            if (err) {
                return cb?.(err, null)
            } else {
                return cb?.(null, vars?.trim().split(/\s+/g) || null)
            }
        })
    }

    get(name: string, cb?: MonkeyCallback) {
        this.send('getvar ' + name, cb)
        return this
    }

    sleep(ms: number, cb?: MonkeyCallback) {
        this.send('sleep ' + ms, cb)
        return this
    }

    quit(cb?: MonkeyCallback) {
        this.send('quit', cb)
        return this
    }

    done(cb?: MonkeyCallback) {
        this.send('done', cb)
        return this
    }

    getAmCurrentAction(cb?: MonkeyCallback) {
        this.get('am.current.action', cb)
        return this
    }

    getAmCurrentCategories(cb?: MonkeyCallback) {
        this.get('am.current.categories', cb)
        return this
    }

    getAmCurrentCompClass(cb?: MonkeyCallback) {
        this.get('am.current.comp.class', cb)
        return this
    }

    getAmCurrentCompPackage(cb?: MonkeyCallback) {
        this.get('am.current.comp.package', cb)
        return this
    }

    getAmCurrentData(cb?: MonkeyCallback) {
        this.get('am.current.data', cb)
        return this
    }

    getAmCurrentPackage(cb?: MonkeyCallback) {
        this.get('am.current.package', cb)
        return this
    }

    getBuildBoard(cb?: MonkeyCallback) {
        this.get('build.board', cb)
        return this
    }

    getBuildBrand(cb?: MonkeyCallback) {
        this.get('build.brand', cb)
        return this
    }

    getBuildCpuAbi(cb?: MonkeyCallback) {
        this.get('build.cpu_abi', cb)
        return this
    }

    getBuildDevice(cb?: MonkeyCallback) {
        this.get('build.device', cb)
        return this
    }

    getBuildDisplay(cb?: MonkeyCallback) {
        this.get('build.display', cb)
        return this
    }

    getBuildFingerprint(cb?: MonkeyCallback) {
        this.get('build.fingerprint', cb)
        return this
    }

    getBuildHost(cb?: MonkeyCallback) {
        this.get('build.host', cb)
        return this
    }

    getBuildId(cb?: MonkeyCallback) {
        this.get('build.id', cb)
        return this
    }

    getBuildManufacturer(cb?: MonkeyCallback) {
        this.get('build.manufacturer', cb)
        return this
    }

    getBuildModel(cb?: MonkeyCallback) {
        this.get('build.model', cb)
        return this
    }

    getBuildProduct(cb?: MonkeyCallback) {
        this.get('build.product', cb)
        return this
    }

    getBuildTags(cb?: MonkeyCallback) {
        this.get('build.tags', cb)
        return this
    }

    getBuildType(cb?: MonkeyCallback) {
        this.get('build.type', cb)
        return this
    }

    getBuildUser(cb?: MonkeyCallback) {
        this.get('build.user', cb)
        return this
    }

    getBuildVersionCodename(cb?: MonkeyCallback) {
        this.get('build.version.codename', cb)
        return this
    }

    getBuildVersionIncremental(cb?: MonkeyCallback) {
        this.get('build.version.incremental', cb)
        return this
    }

    getBuildVersionRelease(cb?: MonkeyCallback) {
        this.get('build.version.release', cb)
        return this
    }

    getBuildVersionSdk(cb?: MonkeyCallback) {
        this.get('build.version.sdk', cb)
        return this
    }

    getClockMillis(cb?: MonkeyCallback) {
        this.get('clock.millis', cb)
        return this
    }

    getClockRealtime(cb?: MonkeyCallback) {
        this.get('clock.realtime', cb)
        return this
    }

    getClockUptime(cb?: MonkeyCallback) {
        this.get('clock.uptime', cb)
        return this
    }

    getDisplayDensity(cb?: MonkeyCallback) {
        this.get('display.density', cb)
        return this
    }

    getDisplayHeight(cb?: MonkeyCallback) {
        this.get('display.height', cb)
        return this
    }

    getDisplayWidth(cb?: MonkeyCallback) {
        this.get('display.width', cb)
        return this
    }
}
