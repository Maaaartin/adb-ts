import moment from 'moment';
import { TouchOptions } from '../..';
import FileSystemCommand from '../filesystem';

export default class TouchCommand extends FileSystemCommand {
  intentArgs(options?: TouchOptions) {
    const args: string[] = [];
    if (!options) {
      return args;
    } else {
      if (options.aTime) {
        args.push('-a');
      }
      if (options.mTime) {
        args.push('-m');
      }
      if (options.noCreate) {
        args.push('-c');
      }
      if (options.symlink) {
        args.push('-h');
      }
      if (options.date) {
        args.push('-d', moment(options.date).toISOString());
      }
      if (options.time) {
        args.push('-t', moment(options.time).format('YYMMDDhhmm[.]ss'));
      }
      if (options.reference) {
        args.push('-r', options.reference);
      }
      return args;
    }
  }

  getCmd() {
    return 'touch';
  }

  execute(serial: string, path: string, options?: TouchOptions) {
    return super.execute(serial, path, options);
  }
}
