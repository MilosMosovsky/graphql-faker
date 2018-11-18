import * as jsonfile from "jsonfile";
import * as path from "path";
import chalk from "chalk";

import { Base } from "../Base";
import { proxyMiddleware } from "../proxy";
import { existsSync } from "../utils";
import { createServer } from "../server";
import { createIdl } from "../idl";
import { Source } from "graphql";
import { fakeSchema } from "../fake-schema";

export class Runner extends Base {
  userIDL: any;
  opts: any;
  extendUrl: string;
  corsOptions: any;
  configPath: string;
  server: any;
  idlApi: any;
  fileName: string;

  constructor(opts: any = {}, config = {}) {
    super(config);

    const corsOptions = {};
    const { configPath, idl, extendUrl, extend, corsOrigin } = opts;

    corsOptions["credentials"] = true;
    corsOptions["origin"] = corsOrigin ? corsOrigin : true;

    this.opts = opts;
    this.extendUrl = extendUrl || extend;
    this.corsOptions = corsOptions;
    this.userIDL = idl;
    this.configPath = configPath;
    this.fileName = opts;
    this.server = createServer({ corsOptions, opts });
  }

  setUserIdl() {
    let { userIDL } = this;
    if (userIDL) return;

    const { fileName, config } = this;

    this.idlApi = createIdl({ fileName }, config);
    userIDL = existsSync(fileName)
      ? this.idlApi.readIDL(fileName)
      : this.defaultIdl;
  }

  get defaultIdl() {
    return this.idlApi.readIDL(
      path.join(this.rootPath, "typedefs", this.defaultFileName)
    );
  }

  get defaultFileName() {
    return this.extendUrl ? "default-extend.graphql" : "default-schema.graphql";
  }

  get configObj() {
    try {
      return this.config || jsonfile.readFileSync(this.configPath);
    } catch (err) {
      this.error(err);
    }
  }

  run() {
    const { opts } = this;
    let { extendUrl } = opts;
    this.setUserIdl();
    extendUrl ? this.runProxyMode() : this.runNormalMode();
  }

  runNormalMode() {
    const { server, userIDL, configObj } = this;
    server
      .configure(userIDL, null, schema => {
        fakeSchema(schema, configObj);
        return { schema };
      })
      .run();
  }

  runProxyMode() {
    let { extendUrl, headers } = this.opts;
    const { userIDL } = this;
    // run in proxy mode
    const url = extendUrl;
    proxyMiddleware(url, headers)
      .then(([schemaIDL, cb]) => {
        schemaIDL = new Source(schemaIDL, `Inrospection from "${url}"`);
        this.server.configure(schemaIDL, userIDL, cb).run();
      })
      .catch(error => {
        this.error(chalk.red(error.stack));
        process.exit(1);
      });
  }
}
