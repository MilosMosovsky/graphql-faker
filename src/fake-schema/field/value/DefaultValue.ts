import { Base } from "../../Base";

export class DefaultValue extends Base {
  ctx: any;
  genValue: Function;

  constructor(functions, ctx, config) {
    super(config);
    this.ctx = ctx;
    this.genValue = functions.genValue;
  }

  resolve() {
    // try resolving value based purely on type and field
    const { type } = this.ctx;
    try {
      const exValue = this.genValue();
      const value = exValue || this.fakeValue(null, null, null, this.ctx);
      // if no value returned, fallback to using leaf resolver
      return value !== undefined
        ? value
        : this.getLeafResolver(type, this.config);
    } catch (err) {
      // if error on resolve, fallback to using leaf resolver (ie. generic value by field type)
      return this.getLeafResolver(type, this.config);
    }
  }
}
