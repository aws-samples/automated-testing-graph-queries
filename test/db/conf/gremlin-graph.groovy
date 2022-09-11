def globals = [:]

// define the default TraversalSource to bind queries to - this one will be named "g".
globals << [g : graph1.traversal()]