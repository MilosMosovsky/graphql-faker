import { FakeBase } from "../../FakeBase";

export class DefaultValue extends FakeBase {
  ctx: any;
  genValue: Function;

  constructor(functions, ctx, config) {
    super(config);
    this.ctx = ctx;
    this.genValue = functions.genValue;
  }

  resolve() {
    // try resolving value based purely on type and field
    try {
      const exValue = this.genValue();
      const value = exValue || this.fakeValue();
      // if no value returned, fallback to using leaf resolver
      return value !== undefined ? value : this.getLeafResolver(this.ctx);
    } catch (err) {
      // if error on resolve, fallback to using leaf resolver (ie. generic value by field type)
      return this.getLeafResolver(this.ctx);
    }
  }
}
