import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const getStrapiUrl = () => {
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost") {
      return "http://localhost:1337";
    } else {
      return process.env.NEXT_PUBLIC_STRAPI_BASE_URL;
    }
  }
  return process.env.STRAPI_GRAPHQL_API || "http://localhost:1337";
};

const client = new ApolloClient({
  link: new HttpLink({ uri: `${getStrapiUrl()}/graphql` }),
  cache: new InMemoryCache(),
});

export default client;
