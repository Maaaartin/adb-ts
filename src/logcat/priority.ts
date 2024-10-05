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

export function charToPriority(char: string): Priority {
    // console.log(char);
    switch (char) {
        case 'V':
            return Priority.VERBOSE;
        case 'D':
            return Priority.DEBUG;
        case 'I':
            return Priority.INFO;
        case 'W':
            return Priority.WARN;
        case 'E':
            return Priority.ERROR;
        case 'F':
            return Priority.FATAL;
        case 'S':
            return Priority.SILENT;
        default:
            // TODO should throw?
            return Priority.DEFAULT;
    }
}
