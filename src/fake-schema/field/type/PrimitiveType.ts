import { FakeBase } from "../../FakeBase";
import { Random } from "../directives/fake/fakers";

export class PrimitiveType extends FakeBase {
  type: any;
  field: any;
  directives: any;
  random: any;
  // fake: any;
  // examples: any;
  // mock: any;

  constructor({ type, field, directives }, config) {
    super(config);
    this.type = type;
    this.field = field;
    this.directives = directives;
    this.random = new Random({ field, type }, config);

    // this.fake = fake;
    // this.examples = examples;
    // this.mock = mock;
  }

  get resolver() {
    const {
      fakeResolver,
      mockResolver,
      examplesResolver,
      defaultResolver
    } = this;
    return mockResolver || examplesResolver || fakeResolver || defaultResolver;
  }

  get defaultResolver() {
    return () => {
      this.resolveDefaultValue({
        genValue: this.random.genRandom,
        getLeafResolver: this.getLeafResolver
      });
    };
  }

  get fakeResolver() {
    const { fake } = this.directives;
    if (!fake) return;
    return () => this.fakeValue();
  }

  get examplesResolver() {
    const { examples } = this.directives;
    if (!examples) return;
    return () => this.random.genRandom();
  }

  get mockResolver() {
    const { field, type, directives } = this;
    const { examples, mock } = directives;
    if (!this.isEnabled("mocking")) return;
    const genValue = () => examples.values[0];
    if (mock) return () => mock.value;
    if (examples) return () => examples.values;
    return () => this.resolveMockValue({ genValue }, { type, field });
  }
}
