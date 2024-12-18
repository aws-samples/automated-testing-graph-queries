/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 * */
import { Airport, Route } from "../domain/interfaces";

/**
 * An interface that defines operations on airports
 *
 * @interface
 */
export default interface IAirport {
  /**
   * Gets all airports in the graph
   *
   * @returns {Promise<Airport[]>} a promise that resolves to a list of objects representing airports
   */
  getAllAirports: () => Promise<Array<Airport> | undefined>;

  /**
   * Gets all possible routes between two airports in the graph
   *
   * @param fromAirportCode the code of the airport to get toutes from
   * @param toAirportCode the code of the airport to get routes to
   * @returns {Promise<Route[]>} a promise that resolves to a list of objects representing routes between airports
   */
  getRoutes: (
    fromAirportCode: string,
    toAirportCode: string
  ) => Promise<Array<Route> | undefined>;
}
