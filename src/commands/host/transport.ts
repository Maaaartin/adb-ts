import Command from "../../command";
import { encodeData, Reply } from "../..";

export default class HostTransportCommand extends Command {
  execute(serial: string) {
    var encoded;
    encoded = encodeData("host:transport:" + serial);
    this.connection.write(encoded);
    return this.parser.readAscii(4).then((reply) => {
      switch (reply) {
        case Reply.OKAY:
          return true;
        case Reply.FAIL:
          return this.parser.readError();
        default:
          return this.parser.unexpected(reply, "OKAY or FAIL");
      }
    });
  }
}
