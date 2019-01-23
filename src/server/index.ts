import * as opn from "opn";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { pick } from "lodash";
import { Source } from "graphql";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { createServerSchema, buildServerSchema } from "../server-schema";
import * as path from "path";
import chalk from "chalk";
import { Base } from "../Base";

// TODO: turn into class
export function createServer(opts: any = {}) {
  return new Server(opts);
}

export function runServer(opts: any = {}, schemaIDL, extensionIDL, optionsCB) {
  return new Server(opts).configure(schemaIDL, extensionIDL, optionsCB).run();
}

export class Server extends Base {
  corsOptions: any;
  IDL: any;
  opts: any;
  schema: any;
  forwardHeaderNames: string[];
  app: any;
  schemaIDL: any;
  extensionIDL: any;
  callbackFn: any;
  opened: boolean;
  running: boolean;
  routes: any = {};
  server: any;
  shutdown: () => void;
  wasShutdown: boolean;
  exitOnShutdown: boolean = true;

  constructor({ corsOptions, opts = {}, IDL, config = {} }: any) {
    super(config);
    this.corsOptions = corsOptions;
    this.IDL = IDL;
    this.opts = opts;
    const { readIDL } = IDL;
    this.schema = createServerSchema({ readIDL, opts });
    this.forwardHeaderNames = (opts.forwardHeaders || []).map(str =>
      str.toLowerCase()
    );
  }

  configure(schemaIDL: Source, extensionIDL: Source, callbackFn: Function) {
    this.schemaIDL = schemaIDL;
    this.extensionIDL = extensionIDL;
    this.callbackFn = callbackFn;

    const { build } = this.schema;
    const app = express();
    this.app = app;

    if (extensionIDL) {
      const schema = build(schemaIDL);
      extensionIDL.body = extensionIDL.body.replace(
        "<RootTypeName>",
        schema.getQueryType().name
      );
    }

    this.configEditor()
      .configGraphQL()
      .configUserIdl();

    return this;
  }

  configEditor() {
    const { app } = this;
    app.use("/editor", express.static(path.join(__dirname, "editor")));
    this.routes.editor = true;
    return this;
  }

  configGraphQL() {
    const {
      app,
      schemaIDL,
      extensionIDL,
      forwardHeaderNames,
      config,
      callbackFn
    } = this;
    const corsConf = cors(this.corsOptions);

    app.options("/graphql", corsConf);
    app.use(
      "/graphql",
      corsConf,
      graphqlHTTP(req => {
        const schema = buildServerSchema(schemaIDL);
        const forwardHeaders = pick(req.headers, forwardHeaderNames);
        return {
          ...callbackFn(schema, extensionIDL, forwardHeaders, config),
          graphiql: true
        };
      })
    );
    this.routes.graphql = true;
    return this;
  }

  configUserIdl() {
    const { app } = this;
    let { schemaIDL, extensionIDL } = this;
    const { saveIDL } = this.IDL;

    app.get("/user-idl", (_, res) => {
      res.status(200).json({
        schemaIDL: schemaIDL.body,
        extensionIDL: extensionIDL && extensionIDL.body
      });
    });

    app.use("/user-idl", bodyParser.text({ limit: "8mb" }));

    app.post("/user-idl", (req, res) => {
      try {
        if (extensionIDL === null) schemaIDL = saveIDL(req.body);
        else extensionIDL = saveIDL(req.body);

        res.status(200).send("ok");
      } catch (err) {
        res.status(500).send(err.message);
      }
    });
    this.routes.userIdl = true;
  }

  run(opts: any = {}) {
    const { app, log } = this;
    opts = {
      ...this.opts,
      opts
    };
    const { open, port } = opts;
    this.server = app.listen(opts.port);

    const shutdown = () => {
      this.server.close();
      this.running = false;
      this.wasShutdown = true;
      if (this.exitOnShutdown) {
        process.exit(0);
      }
    };

    this.shutdown = shutdown;

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    log(`\n${chalk.green("✔")} Your GraphQL Fake API is ready to use 🚀
    Here are your links:
  
    ${chalk.blue("❯")} Interactive Editor:\t http://localhost:${port}/editor
    ${chalk.blue("❯")} GraphQL API:\t http://localhost:${port}/graphql
  
    `);

    if (open) {
      this.opened = true;
      setTimeout(() => opn(`http://localhost:${port}/editor`), 500);
    }
    this.running = true;
    return this;
  }
}
