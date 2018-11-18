import * as opn from "opn";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import { pick } from "lodash";
import { Source } from "graphql";
import * as express from "express";
import * as graphqlHTTP from "express-graphql";
import { createSchemaApi } from "../build-schema";
import * as path from "path";
import chalk from "chalk";

// TODO: turn into class
export function createServerApi({ corsOptions, opts = {}, IDL }: any) {
  const log = console.log;
  const { saveIDL, readIDL } = IDL;
  const { buildServerSchema } = createSchemaApi({ readIDL, opts });
  const { forwardHeaders, open, port } = opts;

  const forwardHeaderNames = (forwardHeaders || []).map(str =>
    str.toLowerCase()
  );

  function runServer(
    schemaIDL: Source,
    extensionIDL: Source,
    config = {},
    optionsCB
  ) {
    const app = express();

    if (extensionIDL) {
      const schema = buildServerSchema(schemaIDL);
      extensionIDL.body = extensionIDL.body.replace(
        "<RootTypeName>",
        schema.getQueryType().name
      );
    }
    app.options("/graphql", cors(corsOptions));
    app.use(
      "/graphql",
      cors(corsOptions),
      graphqlHTTP(req => {
        const schema = buildServerSchema(schemaIDL);
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

  return {
    runServer
  };
}
