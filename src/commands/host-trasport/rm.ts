import { RmOptions } from 'fs'
import FileSystemCommand from '../filesystem'

export default class RmCommand extends FileSystemCommand {
    intentArgs(options?: RmOptions) {
        const args: string[] = []
        if (!options) {
            return args
        }
        if (options.force) {
            args.push('-f')
            delete options.force
        }
        if (options.recursive) {
            args.push('-rR')
            delete options.recursive
        }

        for (const item of Object.entries(options)) {
            args.push(item[0], this.escape(item[1]))
        }
        return args
    }

    getCmd() {
        return 'rm'
    }

    execute(serial: string, path: string, options?: RmOptions) {
        return super.execute(serial, path, options)
    }
}
