import Promise from 'bluebird'
import { EventEmitter } from 'events'
import { IAdbDevice, PrematureEOFError } from '.'
import AdbClient from './client'
import AdbDevice from './device'
import DevicesCommand from './devices'

Promise.config({ cancellation: true })

export default class Tracker extends EventEmitter {
    private readonly command: DevicesCommand
    private deviceMap: { [key: string]: IAdbDevice }
    private reader: Promise<IAdbDevice[] | void>
    private readonly client: AdbClient
    constructor(command: DevicesCommand, client: AdbClient) {
        super()
        this.command = command
        this.deviceMap = {}
        this.client = client
        this.reader = this.read()
            .catch(PrematureEOFError, () => {
                throw new Error('Connection closed')
            })
            .catch((err) => {
                this.emit('error', err)
            })
            .finally(() => {
                return this.command
                    .getParser()
                    .end()
                    .then(() => {
                        this.emit('end')
                    })
            })
    }

    private read(): Promise<any> {
        return this.command
            .readDevices()
            .then((list: IAdbDevice[]) => {
                this.update(list)
                return this.read()
            })
            .catch((err) => {
                this.emit('error', err)
            })
    }

    private update(list: IAdbDevice[]) {
        const newMap: { [key: string]: IAdbDevice } = {}
        for (const d of list) {
            const oldDevice = this.deviceMap[d.id]
            if (oldDevice) {
                if (d.state !== oldDevice?.state) {
                    this.emit('change', new AdbDevice(this.client, d))
                }
            } else {
                this.emit('add', new AdbDevice(this.client, d))
            }
            newMap[d.id] = d
        }
        for (const d of Object.values(this.deviceMap)) {
            if (!newMap[d.id]) {
                this.emit('remove', d)
            }
        }
        this.deviceMap = newMap
    }

    public end() {
        this.reader.cancel()
    }

    on(event: 'add' | 'change', listener: (device: AdbDevice) => void): this
    on(event: 'remove', listener: (device: IAdbDevice) => void): this
    on(event: 'end', listener: () => void): this
    on(event: 'error', listener: (err: Error) => void): this
    on(event: string, listener: (...args: any[]) => void) {
        return super.on(event, listener)
    }
}
