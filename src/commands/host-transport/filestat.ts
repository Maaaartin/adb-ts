import Promise from 'bluebird';
import FileStats, { IFileStats } from '../../filestats';
import TransportParseAllCommand from '../transport-parse-all-command';

export default class FileStatCommand extends TransportParseAllCommand {
  protected parse(value: string) {
    const props = value.split('\\_');
    if (props.length === 1) {
      throw new Error(value.trim());
    }
    const parsed: IFileStats = {
      abits: parseInt(props[0], 8),
      aflags: props[1],
      blocks: Number(props[2]),
      bytes: Number(props[3]),
      seccon: props[4],
      dev: Number(props[5]),
      mode: parseInt(props[7], 16),
      type: props[8],
      gid: Number(props[9]),
      gname: props[10],
      nlink: Number(props[11]),
      ino: Number(props[12]),
      moutpoint: props[13],
      name: props[14],
      lname: props[15],
      blksize: Number(props[16]),
      size: Number(props[17]),
      dTypeMajor: parseInt(props[18], 16),
      dTypeMinor: parseInt(props[19], 16),
      uid: Number(props[20]),
      uname: props[21],
      atime: new Date(props[22]),
      atimeMs: Number(props[23]),
      mtime: new Date(props[24]),
      mtimeMs: Number(props[25]),
      ctime: new Date(props[26]),
      ctimeMs: Number(props[27]),
    };

    return new FileStats(parsed);
  }

  execute(serial: string, path: string): Promise<FileStats> {
    const flags = [
      'a',
      'A',
      'b',
      'B',
      'C',
      'd',
      'D',
      'f',
      'F',
      'g',
      'G',
      'h',
      'i',
      'm',
      'n',
      'N',
      'o',
      's',
      't',
      'T',
      'u',
      'U',
      'x',
      'X',
      'y',
      'Y',
      'z',
      'Z',
    ];
    return super.execute(
      serial,
      `shell:stat -c "%${flags.join('\\_%')}"`,
      path
    );
  }
}
