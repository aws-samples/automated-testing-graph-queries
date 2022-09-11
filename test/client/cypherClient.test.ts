/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 * */
import Dod from "./../dod";
import { CypherClient } from "../../src/client/cypherClient";
import { GremlinTestClient } from "./gremlinTestClient";

//All tests execute against the Gremlin Server within the Docker container running locally
const localUrl = "ws://localhost:8182/gremlin";

let client: CypherClient;
let g: GremlinTestClient;

beforeEach(async () => {
  g = new GremlinTestClient(localUrl);
  await Dod.createTestGraph(localUrl, g);
  client = new CypherClient(localUrl);
});

describe("CypherClient", () => {
  describe("get vertices", () => {
    it("should successfully get all vertices", async () => {
      const result: Array<Map<any, any>> = await client.getAllVertices();
      expect(result).not.toEqual(null);
      expect(result.length).toBe(16);
    });
  });

  describe("get routes between cities", () => {
    it("should successfully get routes between HRE and JNB", async () => {
      const result: Array<Map<any, any>> = await client.getRoutes(
        "code",
        "HRE",
        "code",
        "JNB"
      );
      expect(result).not.toEqual(null);
      expect(result.length).toBe(3);
    });
  });
});

afterEach(async () => {
  await g.dropDatabase();
  await g.closeConnection();
});
