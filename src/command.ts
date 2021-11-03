import Connection from './connection'
import { encodeData } from '.'
import Parser from './parser'
import Promise from 'bluebird'

export default abstract class Command implements Command {
    protected readonly connection: Connection
    protected readonly parser: Parser
    constructor(connection: Connection) {
        this.connection = connection
        this.parser = new Parser(this.connection)
    }

    public getConnection() {
        return this.connection
    }

    public getParser() {
        return this.parser
    }

    public execute(...args: any[]): Promise<any> {
        this.connection.write(encodeData(args.join(' ')))
        return this.parser.readAscii(4).then((reply) => {
            return reply
        })
    }

    escape(arg?: any): string {
        switch (typeof arg) {
            case 'undefined':
                return ''
            case 'string':
                return "'" + arg.replace(/'/g, "'\"'\"'") + "'"
            default:
                return `${arg}`
        }
    }

    escapeCompat(arg?: any): string {
        switch (typeof arg) {
            case 'undefined':
                return ''
            case 'string':
                return '"' + arg.replace(/([$`\\!"])/g, '\\$1') + '"'
            default:
                return `${arg}`
        }
    }
}
