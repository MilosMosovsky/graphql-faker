import * as path from "path";
import { concatAST, buildASTSchema, parse } from "graphql";

export function createSchemaApi({ readIDL, opts = {} }: any) {
  function readAST(filepath) {
    return parse(readIDL(filepath));
  }

  const fakeDefFile = opts.fakeDefFile || "fake-definition.graphql";
  const fakeDefFilePath =
    opts.fakeDefFilePath || path.join(__dirname, "typedefs", fakeDefFile);

  const fakeDefinitionAST = readAST(fakeDefFilePath);

  function buildServerSchema(idl) {
    var ast = concatAST([parse(idl), fakeDefinitionAST]);
    return buildASTSchema(ast);
  }

  return {
    buildServerSchema
  };
}
