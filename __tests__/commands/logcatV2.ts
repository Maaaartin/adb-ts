import LogcatCommand from '../../lib/commands/host-transport/logcatV2';
import { Connection } from '../../lib/connection';
import { PriorityV2 } from '../../lib/logcat';

describe('LogcatV2 tests', () => {
    it('should construct commands without options', () => {
        const connection = new Connection();
        const command = new LogcatCommand(connection, 'serial');
        expect(command).toHaveProperty(
            'Cmd',
            'shell:echo && logcat --format=printable,year,UTC 2>/dev/null'
        );
    });

    it('should construct commands with priority filters', () => {
        const connection = new Connection();
        const command = new LogcatCommand(connection, 'serial', {
            filterSpecs: {
                filters: Object.values(PriorityV2).map((priority) => ({
                    tag: 'test',
                    priority
                }))
            }
        });
        const expectedFilters = Object.values(PriorityV2)
            .map((priority) => `test:${priority}`)
            .join(' ');
        expect(command).toHaveProperty(
            'Cmd',
            `shell:echo && logcat ${expectedFilters} --format=printable,year,UTC 2>/dev/null`
        );
    });

    it('should construct commands with priority filters and silence option', () => {
        const connection = new Connection();
        const command = new LogcatCommand(connection, 'serial', {
            filterSpecs: {
                filters: Object.values(PriorityV2).map((priority) => ({
                    tag: 'test',
                    priority
                })),
                silenceOthers: true
            }
        });
        const expectedFilters = Object.values(PriorityV2)
            .map((priority) => `test:${priority}`)
            .join(' ');
        expect(command).toHaveProperty(
            'Cmd',
            `shell:echo && logcat ${expectedFilters} *:${PriorityV2.SILENT} --format=printable,year,UTC 2>/dev/null`
        );
    });
});
