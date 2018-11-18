import { Base } from "../../Base";
import { Random } from "../directives/fake/fakers";

export class PrimitiveValue extends Base {
  type: any;
  field: any;
  directives: any;
  random: any;

  constructor({ type, field, directives }, config) {
    super(config);
    this.type = type;
    this.field = field;
    this.directives = directives;
    this.random = new Random({ field, type }, config);
  }

  get resolver() {
    const { fake, examples, mock } = this.directives;
    const { field, type } = this;
    if (this.isEnabled("mocking")) {
      const genValue = () => examples.values[0];
      if (mock) return () => mock.value;
      if (examples) return () => examples.values;
      return () => this.resolveMockValue({ genValue }, { type, field });
    }
    if (examples) return () => this.random.genRandom();
    if (fake) {
      return () => this.fakeValue(fake, this);
    }
    const functions = {
      genValue: this.random.genRandom,
      getLeafResolver: this.getLeafResolver
    };
    return () => {
      this.resolveDefaultValue(functions);
    };
  }
}
