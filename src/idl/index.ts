import * as fs from "fs";
import { Source } from "graphql";
import chalk from "chalk";
import { Base } from "../Base";
export function readIdl(idl, opts = {}, config = {}) {
  const idlApi = createIdl(opts, config);
  return idlApi.readIDL(idl);
}

export function createIdl(opts: any = {}, config: any = {}) {
  return new Idl(opts, config);
}

export class Idl extends Base {
  opts: any;
  fileName: string;

  constructor(opts: any = {}, config: any = {}) {
    super(config);
    this.opts = opts;
    const { fileName } = opts;
    this.fileName = fileName;
  }

  readIDL(filepath) {
    return new Source(fs.readFileSync(filepath, "utf-8"), filepath);
  }

  saveIDL(idl) {
    const { fileName } = this;
    fs.writeFileSync(fileName, idl);
    this.log(
      `${chalk.green("✚")} schema saved to ${chalk.magenta(
        fileName
      )} on ${new Date().toLocaleString()}`
    );
    return new Source(idl, fileName);
  }
}
