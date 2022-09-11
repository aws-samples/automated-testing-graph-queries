/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 * */
import { driver } from "gremlin";

export class CypherClient {
  public readonly client: driver.Client;

  /**
   * Creates a new instance of the Cypher client class that queries the
   * database via openCypher. The database must support querying via
   * openCypher. Amazon Neptune supports openCypher and the Gremlin
   * Server test double does via the openCypher Gremlin Server
   * plugin that is added to the server running in the Docker container
   * https://github.com/opencypher/cypher-for-gremlin/tree/master/tinkerpop/cypher-gremlin-server-plugin
   *
   * @param url the URL of the Gremlin endpoint to which to connect
   */
  public constructor(url: string) {
    this.client = new driver.Client(url, {
      traversalsource: "g",
      processor: "cypher",
      mimeType: "application/vnd.gremlin-v3.0+json",
    });
  }

  /**
   * Gets all vertices in the graph
   *
   * @returns {Promise<Array<Map<any, any>>>} a promise that resolves to an array of map objects representing the vertices
   */
  public async getAllVertices(): Promise<Array<Map<any, any>>> {
    try {
      const cypherQuery = "MATCH (n) RETURN n";
      const results = await this.client.submit(cypherQuery);
      return results;
    } finally {
      await this.client.close();
    }
  }

  /**
   * Gets all routes between two vertices with specific property values
   *
   * @param fromVertexPropertyName the name of the property on the source vertex
   * @param fromVertexPropertyValue the value of the property on the source vertex
   * @param toVertexPropertyName the name of the property on the destination vertex
   * @param toVertexPropertyValue the value of ther property on the destination vertex
   * @returns {Promise<any>} a promise that resolves to a list of routes between the vertices
   */
  public async getRoutes(
    fromVertexPropertyName: string,
    fromVertexPropertyValue: string,
    toVertexPropertyName: string,
    toVertexPropertyValue: string
  ): Promise<any> {
    try {
      const cypherQuery = `
        MATCH 
          p=
            (a:airport {${fromVertexPropertyName}: "${fromVertexPropertyValue}"})
              -[*]->
            (b:airport {${toVertexPropertyName}: "${toVertexPropertyValue}"}) 
        RETURN p`;
      const results = await this.client.submit(cypherQuery);
      return results;
    } finally {
      await this.client.close();
    }
  }
}
