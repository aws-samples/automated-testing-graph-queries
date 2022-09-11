/**
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 * */
export interface Vertex {
  id: string;
  label: string;
  attributes: Map<string, any>;
}

export interface Edge {
  id: string;
  label: string;
  from?: Vertex;
  to?: Vertex;
  attributes?: Map<string, any>;
}

export interface Airport {
  code: string;
}

export interface Route {
  from: string;
  to: string;
  distance: number;
  legs: Array<Leg>;
}

export interface Leg {
  from: string;
  to: string;
  distance: number;
}
