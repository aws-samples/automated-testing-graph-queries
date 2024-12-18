/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 * */
import Dod from "./../dod";
import IAirport from "../../src/dao/airportInterface";
import { AirportDAO } from "../../src/dao/airportDao";
import { GremlinTestClient } from "../client/gremlinTestClient";

//All tests execute against the Gremlin Server within the Docker container running locally
const localUrl = "ws://localhost:8182/gremlin";

let airportInterface: IAirport;
let g: GremlinTestClient;

beforeEach(async () => {
  g = new GremlinTestClient(localUrl);
  await Dod.createTestGraph(localUrl, g);
  airportInterface = new AirportDAO(localUrl);
});

describe("AirportDao", () => {
  describe("get all airports", () => {
    it("should get all the airports", async () => {
      const allAirports = await airportInterface.getAllAirports();
      expect(allAirports).not.toEqual(null);
      expect(allAirports.length).toBe(16);
    });
  });

  describe("get all routes between two airports", () => {
    it("should get all the routes between HRE and JNB", async () => {
      const allRoutes = await airportInterface.getRoutes("HRE", "JNB");
      expect(allRoutes).not.toEqual(null);
      expect(allRoutes.length).toBe(3);
    });
  });
});

afterEach(async () => {
  await g.dropDatabase();
  await g.closeConnection();
});
