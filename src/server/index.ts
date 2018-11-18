import * as opn from "opn";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { pick } from "lodash";
import { Source } from "graphql";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { createServerSchema } from "../server-schema";
import * as path from "path";
import chalk from "chalk";
import { Base } from "../Base";

// TODO: turn into class
export function createServer(opts: any = {}) {
  return new Server(opts);
}

export class Server extends Base {
  corsOptions: any;
  IDL: any;
  opts: any;
  schema: any;
  forwardHeaderNames: string[];

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

  runServer(schemaIDL: Source, extensionIDL: Source, config = {}, optionsCB) {
    const { saveIDL } = this.IDL;
    const { build } = this.schema;
    const { corsOptions, opts, forwardHeaderNames, log } = this;
    const { open, port } = opts;
    const app = express();
    const corsConf = cors(corsOptions);

    if (extensionIDL) {
      const schema = build(schemaIDL);
      extensionIDL.body = extensionIDL.body.replace(
        "<RootTypeName>",
        schema.getQueryType().name
      );
    }
    app.options("/graphql", corsConf);
    app.use(
      "/graphql",
      corsConf,
      graphqlHTTP(req => {
        const schema = build(schemaIDL);
        const forwardHeaders = pick(req.headers, forwardHeaderNames);
        return {
          ...optionsCB(schema, extensionIDL, forwardHeaders, config),
          graphiql: true
        };
      })
    );

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

    app.use("/editor", express.static(path.join(__dirname, "editor")));

    const server = app.listen(opts.port);

    const shutdown = () => {
      server.close();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    log(`\n${chalk.green("✔")} Your GraphQL Fake API is ready to use 🚀
    Here are your links:
  
    ${chalk.blue("❯")} Interactive Editor:\t http://localhost:${port}/editor
    ${chalk.blue("❯")} GraphQL API:\t http://localhost:${port}/graphql
  
    `);

    if (open) {
      setTimeout(() => opn(`http://localhost:${port}/editor`), 500);
    }
  }
}
