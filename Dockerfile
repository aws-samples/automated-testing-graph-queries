FROM tinkerpop/gremlin-server:3.4.12
RUN wget https://github.com/opencypher/cypher-for-gremlin/releases/download/v1.0.4/cypher-gremlin-server-plugin-1.0.4-all.jar && cp cypher-gremlin-server-plugin-1.0.4-all.jar /opt/gremlin-server/lib
