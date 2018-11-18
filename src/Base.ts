import * as path from "path";
import { log } from "./fake-schema/utils";

export class Base {
  config: any;
  log: (...args) => void;

  constructor(config) {
    this.config = config;
    if (this.isEnabled("logging")) {
      config.log = config.log || log;
    }
    this.log = config.log;
  }

  error(msg, data?) {
    data ? console.error(msg, data) : console.error(msg);
    throw new Error(msg);
  }

  isEnabled(name) {
    const enabled = this.config.enable || {};
    return enabled[name];
  }

  get rootPath() {
    return path.join(__dirname, "..");
  }
}
