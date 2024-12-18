/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 * */
import { GremlinClient } from "../../src/client/gremlinClient";

/**
 * An extension of the base client class with additional methods to drop the entire
 * graph and manage the database connection.
 */
export class GremlinTestClient extends GremlinClient {
  public async dropDatabase(): Promise<void> {
    await this.g.V().drop().iterate();
  }

  public async closeConnection(): Promise<void> {
    await this.dc.close();
  }
}
