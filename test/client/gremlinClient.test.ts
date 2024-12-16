/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 * */
import { GremlinTestClient } from "./gremlinTestClient";
import Dod from "./../dod";
import { process } from "gremlin";
import { v4 as uuidv4 } from "uuid";

//All tests execute against the Gremlin Server within the Docker container running locally
const localUrl = "ws://localhost:8182/gremlin";

let g: GremlinTestClient;

beforeEach(async () => {
  g = new GremlinTestClient(localUrl);
  await Dod.createTestGraph(localUrl, g);
});

describe("GremlinClient", () => {
  describe("add a vertex", () => {
   it("should successfully add a vertex", async () => {
      const vertexId = uuidv4();
      const vertexLabel = uuidv4();
      const result = await g.addVertex(vertexId, vertexLabel, {
        property1: "value1",
        property2: "value2",
      });
      expect(result).not.toEqual(null);
      expect(result.value.get(process.t.id)).toEqual(vertexId);
      expect(result.value.get(process.t.label)).toEqual(vertexLabel);
    });
  });

  describe("get a vertex", () => {
    it("should successfully get a vertex representing HRE airport", async () => {
      const vertexId = "HRE";
      const vertexLabel = "airport";
      const result = await g.getVertex(vertexId);
      expect(result).not.toEqual(null);
      expect(result.value.get(process.t.id)).toEqual(vertexId);
      expect(result.value.get(process.t.label)).toEqual(vertexLabel);
    });
  });

  describe("check if edge exists between 2 airports", () => {
    it("should return true as there is a direct route from HRE to JNB", async () => {
      const result = await g.doesEdgeExist(
        "code",
        "HRE",
        "code",
        "JNB",
        "route"
      );
      expect(result).not.toEqual(null);
      expect(result).toBe(true);
    });

    it("should return false as there is no direct route from HRE to LHR ", async () => {
      const result = await g.doesEdgeExist(
        "code",
        "HRE",
        "code",
        "LHR",
        "route"
      );
      expect(result).not.toEqual(null);
      expect(result).toBe(false);
    });
  });

  describe("get all airports", () => {
    it("should return all airports", async () => {
      const result = await g.getAllVertices();
      expect(result).not.toEqual(null);
      expect(result.length).toBe(16);
    });
  });

  describe("get routes between cities", () => {
    it("should return routes", async () => {
      const result = await g.getRoutes("code", "HRE", "code", "JNB");
      expect(result).not.toEqual(null);
      expect(result.length).toBe(3);
    });
  });
});

afterEach(async () => {
  await g.dropDatabase();
  await g.closeConnection();
});
