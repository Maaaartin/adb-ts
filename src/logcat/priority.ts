import { UnexpectedDataError } from '../util';

export enum Priority {
    DEFAULT = 1,
    VERBOSE = 2,
    DEBUG = 3,
    INFO = 4,
    WARN = 5,
    ERROR = 6,
    FATAL = 7,
    SILENT = 8
}

export enum PriorityV2 {
    // DEFAULT = 'D',
    VERBOSE = 'V',
    DEBUG = 'D',
    INFO = 'I',
    WARN = 'W',
    ERROR = 'E',
    FATAL = 'F',
    SILENT = 'S'
}

export function charToPriority(char: string): PriorityV2 {
    // console.log(char);
    switch (char) {
        case 'V':
            return PriorityV2.VERBOSE;
        case 'D':
            return PriorityV2.DEBUG;
        case 'I':
            return PriorityV2.INFO;
        case 'W':
            return PriorityV2.WARN;
        case 'E':
            return PriorityV2.ERROR;
        case 'F':
            return PriorityV2.FATAL;
        case 'S':
            return PriorityV2.SILENT;
        default:
            throw new UnexpectedDataError(
                char,
                Object.values(PriorityV2).join('|')
            );
    }
}
