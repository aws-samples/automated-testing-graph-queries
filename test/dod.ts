import { GremlinTestClient } from "./client/gremlinTestClient";

/**
 * The Data On Demand (DOD) class is responsible for genertaing test data
 * and populating the database with it for the tests to execute against.
 *
 */
export default class Dod {
  public static async createTestGraph(
    url: string,
    g: GremlinTestClient
  ): Promise<void> {
    await g.addVertex("HRE", "airport", { code: "HRE", name: "Harare" });
    await g.addVertex("JNB", "airport", { code: "JNB", name: "Johannesburg" });
    await g.addVertex("VFA", "airport", {
      code: "VFA",
      name: "Victoria Falls",
    });
    await g.addVertex("BUQ", "airport", { code: "BUQ", name: "Bulawayo" });
    await g.addVertex("GBE", "airport", { code: "GBE", name: "Gaborone" });
    await g.addVertex("WDH", "airport", { code: "WDH", name: "Windhoek" });
    await g.addVertex("MUB", "airport", { code: "MUB", name: "Maun" });
    await g.addVertex("CPT", "airport", { code: "CPT", name: "Cape Town" });
    await g.addVertex("LAD", "airport", { code: "LAD", name: "Luanda" });
    await g.addVertex("ADD", "airport", { code: "ADD", name: "Addis Ababa" });
    await g.addVertex("LVI", "airport", { code: "LVI", name: "Livingstone" });
    await g.addVertex("LLW", "airport", { code: "LLW", name: "Lilongwe" });
    await g.addVertex("NBO", "airport", { code: "NBO", name: "Nairobi" });
    await g.addVertex("DAR", "airport", { code: "DAR", name: "Dar es Salaam" });
    await g.addVertex("LUN", "airport", { code: "LUN", name: "Lusaka" });
    await g.addVertex("DUR", "airport", { code: "DUR", name: "Durban" });

    await g.addEdge("HRE", "JNB", "route", { distance: 595 });
    await g.addEdge("HRE", "DUR", "route", { distance: 807 });
    await g.addEdge("HRE", "DAR", "route", { distance: 938 });
    await g.addEdge("HRE", "NBO", "route", { distance: 1213 });
    await g.addEdge("HRE", "LLW", "route", { distance: 337 });
    await g.addEdge("HRE", "LVI", "route", { distance: 346 });
    await g.addEdge("HRE", "ADD", "route", { distance: 1931 });
    await g.addEdge("HRE", "LAD", "route", { distance: 1352 });
    await g.addEdge("HRE", "VFA", "route", { distance: 345 });
    await g.addEdge("HRE", "WDH", "route", { distance: 936 });
    await g.addEdge("HRE", "GBE", "route", { distance: 566 });
    await g.addEdge("HRE", "BUQ", "route", { distance: 216 });
    await g.addEdge("HRE", "LUN", "route", { distance: 251 });

    await g.addEdge("VFA", "CPT", "route", { distance: 1183 });
    await g.addEdge("VFA", "MUB", "route", { distance: 204 });
    await g.addEdge("VFA", "WDH", "route", { distance: 621 });
    await g.addEdge("VFA", "ADD", "route", { distance: 2068 });
    await g.addEdge("VFA", "BUQ", "route", { distance: 225 });
    await g.addEdge("VFA", "JNB", "route", { distance: 576 });

    await g.addEdge("CPT", "JNB", "route", { distance: 789 });
  }
}
