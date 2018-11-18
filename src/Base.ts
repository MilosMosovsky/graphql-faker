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

  isEnabled(name) {
    const enabled = this.config.enabled;
    return enabled[name];
  }
}
