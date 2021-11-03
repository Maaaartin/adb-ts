import ValueCommand from './value-command'

export default abstract class ParseCommand extends ValueCommand {
    protected abstract parse(value: string): any
    execute(...params: any[]) {
        return super.execute(...params).then((value) => {
            return this.parse(value)
        })
    }
}
