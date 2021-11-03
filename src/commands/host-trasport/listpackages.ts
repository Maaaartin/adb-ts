import TransportParseAllCommand from '../transport-parse-all-command'
import Promise from 'bluebird'

export default class ListPackagesCommand extends TransportParseAllCommand {
    protected parse(value: string) {
        const packages = []
        let match
        const regExp = /^package:(.*?)\r?$/gm
        while ((match = regExp.exec(value))) {
            packages.push(match[1])
        }
        return packages
    }

    execute(serial: string): Promise<string[]> {
        return super.execute(serial, 'shell:pm list packages 2>/dev/null')
    }
}
