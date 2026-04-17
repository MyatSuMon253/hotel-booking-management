import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import type { OperationDefinitionNode } from "graphql";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_SERVER_URL,
  credentials: "include",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_GRAPHQL_WS!,
  }),
);

const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query) as OperationDefinitionNode;
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  credentials: "include",
});

export default client;
