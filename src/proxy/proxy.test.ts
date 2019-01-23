import { proxyMiddleware } from ".";

describe("proxyMiddleware", () => {
  const url = "localhost:4000/graphql";
  const headers = {};

  const mw = proxyMiddleware(url, headers);

  describe("mw configuration", () => {
    test("is defined", () => {
      expect(mw).toBeDefined();
    });
  });
});
