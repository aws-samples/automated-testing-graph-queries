/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 * */
import { GremlinClient } from "../client/gremlinClient";
import { Airport, Route } from "../domain/interfaces";
import IAirport from "./airportInterface";
import { process } from "gremlin";

let g: GremlinClient;

const NAME: string = "name";
const DISTANCE: string = "distance";
const CODE: string = "code";

/**
 * Class representing airport operations
 *
 * @class
 * @implements {IAirport}
 */
export class AirportDAO implements IAirport {
  public constructor(url: string) {
    g = new GremlinClient(url);
  }

  async getAllAirports(): Promise<Airport[] | undefined> {
    const vertices = await g.getAllVertices()!;
    if (vertices) {
      return vertices.map((v) => {
        return {
          code: v.get(process.t.id),
          name: v.get(NAME),
        };
      });
    }
  }

  /**
   * Gets all possible routes between two airports in the graph
   *
   * @param fromAirportCode the code of the airport to get toutes from
   * @param toAirportCode the code of the airport to get routes to
   * @returns {Promise<Route>} a promise that resolves to a list of objects representing routes between airports
   */
  async getRoutes(
    fromAirportCode: string,
    toAirportCode: string
  ): Promise<Route[] | undefined> {
    const routes = await g.getRoutes(
      CODE,
      fromAirportCode,
      CODE,
      toAirportCode
    );
    const result: Route[] = [];
    if (routes) {
      routes.map((r: any) => {
        const route: Route = {
          from: fromAirportCode,
          to: toAirportCode,
          distance: 0,
          legs: [],
        };
        let routeEnd: boolean = false;
        let leg: any = {};
        r.objects.map((o: Map<string, any>) => {
          const [key] = o.keys();
          const [value] = o.values();
          if (key === DISTANCE) {
            route.distance = route.distance + value;
            leg.distance = value;
            routeEnd = true;
          } else {
            if (!routeEnd) {
              leg.from = value[0];
            } else {
              leg.to = value[0];
              route.legs.push(leg);
              leg = { from: leg.to };
            }
          }
        });
        result.push(route);
      });
    }
    return result;
  }
}
