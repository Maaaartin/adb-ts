import { EventEmitter } from 'events'
import { StatsObject } from '..'

export default class PushTransfer extends EventEmitter {
    private readonly stack: number[] = []
    private readonly stats: StatsObject = {
        bytesTransferred: 0,
    }

    cancel() {
        this.emit('cancel')
    }

    push(byteCount: number) {
        this.stack.push(byteCount)
    }

    pop() {
        const byteCount = this.stack.pop()
        this.stats.bytesTransferred += byteCount || 0
        return this.emit('progress', this.stats)
    }

    end() {
        this.emit('end')
    }

    on(event: 'error', listener: (err: Error) => void): this
    on(event: 'end' | 'cancel', listener: () => void): this
    on(event: 'progress', listener: (stats: StatsObject) => void): this
    on(event: string, listener: (...args: any[]) => void) {
        return super.on(event, listener)
    }
}
