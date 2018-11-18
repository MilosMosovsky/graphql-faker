import { createTypeFakers } from "./fakers";
import { Base } from "../../../Base";

export class FakeValue extends Base {
  constructor(config) {
    super(config);
  }

  get typeFakers() {
    return createTypeFakers(this.config);
  }

  get resolvers() {
    return this.typeFakers.resolvers;
  }
}
