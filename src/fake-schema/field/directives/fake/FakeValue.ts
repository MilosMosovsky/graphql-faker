import { FakeBase } from "../../../FakeBase";

export class FakeValue extends FakeBase {
  constructor(config) {
    super(config);
  }

  get resolvers() {
    return this.getTypeFakers;
  }
}
