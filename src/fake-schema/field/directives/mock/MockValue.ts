import { FakeBase } from "../../../FakeBase";
import { getItem } from "../../../utils";

export class MockValue extends FakeBase {
  getItem: Function;
  genValue: Function;
  ctx: any;
  type: any;
  field: any;

  constructor(functions: any, ctx, config) {
    super(config);
    const { genValue } = functions;
    this.getItem = functions.getItem || getItem;
    this.genValue = genValue;
    this.ctx = ctx;
    const { type, field } = ctx;
    this.type = type;
    this.field = field;
  }

  resolve() {
    // const ctx = {
    //   functions: {
    //     getItem: this.getItem,
    //     getTypeFaker: this.getTypeFaker
    //   }
    // };
    return this.resolveDefaultValue({
      genValue: this.genValue,
      getLeafResolver: this.getLeafResolver
    });
  }

  getTypeFaker() {
    const mockMap = this.isEnabled("mocking") ? this.config.mocks : {};
    const { field, type } = this.ctx;
    return () => {
      let map = mockMap[type.name] || {};
      let res = map[field.name] || map;
      res = map[field.type] || res;
      if (res) return res;

      if (!res) {
        map = mockMap.__types;
        return map[field.type];
      }
    };
  }
}
