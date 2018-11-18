import { proxyMiddleware } from "../proxy";
import { existsSync } from "../utils";
import * as jsonfile from "jsonfile";
import { createServer } from "../server";
import { createIdlApi } from "../idl";
import { Source } from "graphql";
import * as path from "path";
import chalk from "chalk";
import { fakeSchema } from "../fake-schema";
import { Base } from "../Base";

export class Runner extends Base {
  userIDL: any;
  opts: any;
  extendUrl: string;
  corsOptions: any;

  constructor(opts: any = {}, config = {}) {
    super(config);
    this.opts = opts;
    const corsOptions = {};
    const { idl, extendUrl, extend, corsOrigin } = opts;
    this.extendUrl = extendUrl || extend;
    corsOptions["credentials"] = true;
    corsOptions["origin"] = corsOrigin ? corsOrigin : true;
    this.corsOptions = corsOptions;
    this.userIDL = idl;
  }

  run() {
    const { corsOptions, opts } = this;
    let { fileName, extendUrl, headers, configPath, config, log } = opts;
    let { userIDL } = this;

    if (!userIDL) {
      const { readIDL } = createIdlApi({ fileName }, this.config);

      if (existsSync(fileName)) {
        userIDL = readIDL(fileName);
      } else {
        // different default IDLs for extend and non-extend modes
        let defaultFileName = extendUrl
          ? "default-extend.graphql"
          : "default-schema.graphql";
        userIDL = readIDL(path.join(__dirname, "typedefs", defaultFileName));
      }
    }

    const { runServer } = createServer({ corsOptions, opts });
    let configObj;
    try {
      configObj = config || jsonfile.readFileSync(configPath);
    } catch (err) {
      console.error(err);
      throw err;
    }

    if (extendUrl) {
      // run in proxy mode
      const url = extendUrl;
      proxyMiddleware(url, headers)
        .then(([schemaIDL, cb]) => {
          schemaIDL = new Source(schemaIDL, `Inrospection from "${url}"`);
          runServer(schemaIDL, userIDL, config, cb);
        })
        .catch(error => {
          log(chalk.red(error.stack));
          process.exit(1);
        });
    } else {
      runServer(userIDL, null, config, schema => {
        fakeSchema(schema, configObj);
        return { schema };
      });
    }
  }
}
