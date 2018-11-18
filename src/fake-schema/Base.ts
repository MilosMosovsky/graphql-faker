import { log } from "./utils";

export class Base {
  config: any;

  constructor(config) {
    this.config = config;
    if (this.isEnabled("logging")) {
      config.log = config.log || log;
    }
  }

  isEnabled(name) {
    const enabled = this.config.enabled;
    return enabled[name];
  }
}
