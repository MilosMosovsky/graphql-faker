import * as path from "path";
import { concatAST, buildASTSchema, parse } from "graphql";
import { Base } from "../Base";

export function buildServerSchema(
  { readIDL, idl, opts = {} }: any,
  config = {}
) {
  return createServerSchema({ readIDL, opts }, config).build(idl);
}

export function createServerSchema({ readIDL, opts = {} }: any, config = {}) {
  return new ServerSchema({ readIDL, opts }, config);
}

export class ServerSchema extends Base {
  opts: any;
  readIDL: Function;
  fakeDefFilePath: string;
  fakeDefinitionAST: any;

  constructor({ readIDL, opts = {} }: any, config = {}) {
    super(config);
    this.readIDL = readIDL;
    this.opts = opts;

    const fakeDefFile = opts.fakeDefFile || "fake-definition.graphql";
    const fakeDefFilePath =
      opts.fakeDefFilePath || path.join(__dirname, "typedefs", fakeDefFile);

    this.fakeDefinitionAST = this.readAST(fakeDefFilePath);
  }

  readAST(filepath) {
    return parse(this.readIDL(filepath));
  }

  build(idl) {
    var ast = concatAST([parse(idl), this.fakeDefinitionAST]);
    return buildASTSchema(ast);
  }
}
