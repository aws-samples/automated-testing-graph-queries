/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 * */
import { driver, process, structure } from "gremlin";
import { Edge } from "../domain/interfaces";

const {
  t: { id },
} = process;
const {
  cardinality: { single },
} = process;

const __ = process.statics;

const CODE: string = "code";
const DISTANCE: string = "distance";

export class GremlinClient {
  private readonly graph: structure.Graph;
  private __ = process.statics;

  protected readonly g: process.GraphTraversalSource;
  public readonly dc: driver.DriverRemoteConnection;

  /**
   * Creates a new instance of the Gremlin client class that queries the
   * database via Gremlin.
   *
   * @param url the URL of the Gremlin endpoint to which to connect
   */
  public constructor(url: string) {
    const config: any = {
      traversalsource: "g",
      mimeType: "application/vnd.gremlin-v3.0+json",
    };
    this.graph = new structure.Graph();
    this.dc = new driver.DriverRemoteConnection(url, config);
    this.g = this.graph.traversal().withRemote(this.dc);
  }

  /**
   * Adds a new, uniquely identified, vertex to the database
   *
   * @param id the unique identifier of the new vertex to add
   * @param label the label of the vertex
   * @param properties an object representing the properties of the vertex - handles nested properties although the
   * database may not.
   * @returns {Promise<Vertex>} a promise that resolves to an object returned by the Gremlin driver
   */
  public async addVertex(
    vertexId: string,
    label: string,
    properties: any = {}
  ): Promise<any> {
    let write = this.g.addV(label).property(id, vertexId);
    Object.entries(properties || {}).forEach(([key, val]) => {
      //Neptune does not allow the setting of an array of values -
      if (Array.isArray(val)) {
        for (let i = 0; i < val.length; i++) {
          write = write.property(single, key, val[i]);
        }
        return;
      } else if (typeof val === "object") {
        if (val !== null) {
          write = write.property(single, key, val);
        }
        return;
      }
      write = write.property(key, val);
    });
    try {
      const result = await write.valueMap(true).next();
      return result;
    } finally {
      await this.dc.close();
    }
  }

  /**
   * Gets a vertex from the database given its unique identifier.
   * If a vertex does not exist in the database with the provided identifier
   * null is returned.
   *
   * @param id the unique identifier of the vertex to get
   * @returns {Promise<any>} a promise that resolves to an object returned by the driver,
   * or null if a vertex with the identifier cannot be found
   */
  public async getVertex(id: string): Promise<any | null> {
    try {
      const result = await this.g.V(id).valueMap(true).next();
      if (result.value) {
        return result;
      } else {
        return null;
      }
    } finally {
      await this.dc.close();
    }
  }

  /**
   * Gets all vertices in the graph
   *
   * @returns {Promise<any>} a promise that resolves to an array of vertices
   */
  public async getAllVertices(): Promise<any[] | undefined> {
    try {
      const result = await this.g.V().valueMap(true).by(__.unfold()).toList();
      if (result) {
        return result;
      }
    } finally {
      await this.dc.close();
    }
  }

  /**
   * Adds an edge to the graph
   *
   * @param fromVertexId the identifier of the vertex from which the edge runs
   * @param toVertexId the identifier of the vertex to which the edge runs
   * @param label the label to add to the edge
   * @param properties an object containing properties to add to the edge
   * @returns {Promise<Edge>} a promise that resolves to an object representing the edge
   */
  public async addEdge(
    fromVertexId: string,
    toVertexId: string,
    label: string,
    properties: any = {}
  ): Promise<Edge | null> {
    try {
      let write = this.g.V(fromVertexId).addE(label).to(__.V(toVertexId));

      Object.entries(properties || {}).forEach(([key, val]) => {
        if (typeof val === "object") {
          //Neptune does not support nested property objects
          return;
        }
        write = write.property(key, val);
      });

      const result = await write.valueMap(true).next();
      if (result.value) {
        return {
          id: result.value.get(process.t.id),
          label: result.value.get(process.t.label),
        };
      } else {
        return null;
      }
    } finally {
      await this.dc.close();
    }
  }

  /**
   * Checks whether an edge exists in the graph between two vertices with specific properties
   *
   * @param fromVertexPropertyName the name of the property on the source vertex
   * @param fromVertexPropertyValue the value of the property on the source vertex
   * @param toVertexPropertyName the name of the property on the destination vertex
   * @param toVertexPropertyValue the value of ther property on the destination vertex
   * @param edgeLabel the label of the edge to check for
   * @returns {Promise<boolean>} a promise that resolves to true if an edge does exist, otherwise false
   */
  public async doesEdgeExist(
    fromVertexPropertyName: string,
    fromVertexPropertyValue: string,
    toVertexPropertyName: string,
    toVertexPropertyValue: string,
    edgeLabel: string
  ): Promise<boolean> {
    try {
      const result = await this.g
        .V()
        .has(fromVertexPropertyName, fromVertexPropertyValue)
        .out(edgeLabel)
        .has(toVertexPropertyName, toVertexPropertyValue)
        .next();
      if (result.value) {
        return true;
      } else {
        return false;
      }
    } finally {
      await this.dc.close();
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
      const result = await this.g
        .V()
        .has(fromVertexPropertyName, fromVertexPropertyValue)
        .repeat(this.__.outE().inV())
        .until(this.__.has(toVertexPropertyName, toVertexPropertyValue))
        .path()
        .by(__.valueMap(CODE, DISTANCE))
        .toList();
      return result;
    } finally {
      await this.dc.close();
    }
  }
}
