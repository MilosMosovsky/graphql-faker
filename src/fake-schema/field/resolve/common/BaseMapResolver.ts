import { Base } from "../../../../Base";

export class BaseMapResolver extends Base {
  ctx: any;

  constructor(ctx, config = {}) {
    super(config);
    this.ctx = ctx;
  }

  get resolversMap() {
    const resolvers = this.config.resolvers || {};
    return resolvers.maps || {};
  }

  mapsFor(name, defaultMap = {}) {
    const maps = this.config.maps || {};
    return maps[name] || defaultMap || {};
  }

  funsFor(name) {
    return this.resolversMap[name] || {};
  }
}
