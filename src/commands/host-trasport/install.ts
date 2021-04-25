import { InstallOptions, Reply } from '../..';
import TransportCommand from '../tranport';

export default class InstallCommand extends TransportCommand {
  private intentArgs(options?: InstallOptions) {
    const args: string[] = [];
    if (!options) return args;
    if (options.reinstall) {
      args.push('-r');
      delete options.reinstall;
    }
    if (options.test) {
      args.push('-t');
      delete options.test;
    }
    if (options.internal) {
      args.push('-f');
      delete options.internal;
    }
    if (options.allowDowngrade) {
      args.push('-d');
      delete options.allowDowngrade;
    }
    if (options.grandPermissions) {
      args.push('-g');
      delete options.grandPermissions;
    }

    for (const item of Object.entries(options)) {
      args.push(item[0], this.escape(item[1]));
    }
    return args;
  }

  execute(
    serial: string,
    apk: string,
    options?: InstallOptions,
    args?: string
  ) {
    return super
      .execute(
        serial,
        `shell:pm install`,
        ...this.intentArgs(options),
        this.escapeCompat(apk),
        args || ''
      )
      .then((reply) => {
        switch (reply) {
          case Reply.OKAY:
            return this.parser
              .searchLine(/^(Success|Failure \[(.*?)\])$/)
              .then((match) => {
                if (match[1] === 'Success') {
                  return;
                } else {
                  const code = match[2];
                  const err = new Error(
                    apk + ' could not be installed [' + code + ']'
                  );
                  throw err;
                }
              })
              .finally(() => {
                return this.parser.readAll();
              });
          case Reply.FAIL:
            return this.parser.readError();
          default:
            return this.parser.unexpected(reply, 'OKAY or FAIL');
        }
      });
  }
}
