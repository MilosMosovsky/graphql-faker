import { run, Runner } from ".";

describe("run", () => {
  describe("with file", () => {
    const started = run({
      extendUrl: "http://example.com/graphql",
      forwardHeaders: "Authorition",
      file: "./temp.faker.graphql"
    });

    test("started", () => {
      expect(started).toBeDefined();
    });
  });

  describe("with idl", () => {
    const idl = `
      type Pet {
        name: String @fake(type:firstName)
        image: String @fake(type:imageUrl, options: {imageCategory:cats})
      }
    `;

    const started = run({
      extendUrl: "http://example.com/graphql",
      forwardHeaders: "Authorition",
      idl
    });

    test("started", () => {
      expect(started).toBeDefined();
    });
  });
});

describe("Runner", () => {
  describe("with file", () => {
    const runner: any = new Runner({
      extendUrl: "http://example.com/graphql",
      forwardHeaders: "Authorition",
      file: "./temp.faker.graphql"
    });

    test("instance", () => {
      expect(runner).toBeDefined();
    });

    describe("setUserIdl", () => {
      runner.setUserIdl();

      test("has userIdl", () => {
        expect(runner.userIdl).toBeDefined();
      });
    });

    describe("defaultFileName", () => {
      const fileName = runner.defaultFileName;

      test("is a .graphql file", () => {
        expect(fileName).toMatch(/\.graphql/);
      });
    });

    describe("defaultIdl", () => {
      const idl = runner.defaultIdl;

      test("is defined", () => {
        expect(idl).toBeDefined();
      });
    });

    describe("configObj", () => {
      const obj = runner.configObj;

      test("is an object", () => {
        expect(typeof obj).toEqual("object");
      });
    });

    describe("runNormalMode", () => {
      runner.runNormalMode();

      test("running", () => {
        expect(runner.running).toBe(true);
      });
    });

    describe("runProxyMode", () => {
      const proxyCB = () => {
        console.log("proxy server running");
      };

      runner.runProxyMode(proxyCB);

      test("running", () => {
        expect(runner.running).toBe(true);
      });
    });

    describe("run", () => {
      runner.run();

      test("running", () => {
        expect(runner.running).toBe(true);
      });
    });
  });
});
