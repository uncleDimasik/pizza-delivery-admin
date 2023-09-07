import {ApolloClient, createHttpLink, FieldPolicy, InMemoryCache, Reference,} from '@apollo/client';

const link = createHttpLink({
  uri: import.meta.env.VITE_API_URL,
  credentials: 'include',
});

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        orders: offsetLimitPagination(),
      },
    },
  },
});
export const client = new ApolloClient({
  cache,
  link,
});

type KeyArgs = FieldPolicy<any>['keyArgs'];

export function offsetLimitPagination<T = Reference>(
    keyArgs: KeyArgs = false,
): FieldPolicy<T[]> {
  return {
    keyArgs,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    merge(existing, incoming, {args}) {
      return incoming;
    },
  };
}
