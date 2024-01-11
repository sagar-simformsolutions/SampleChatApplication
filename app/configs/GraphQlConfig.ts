import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  split,
  type NormalizedCacheObject
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { CachePersistor, MMKVWrapper } from 'apollo3-cache-persist';

import { SubscriptionClient } from 'subscriptions-transport-ws';
import { AppConst } from '../constants';
import { storage } from '../services';
import { getToken } from '../utils/utils';

/* Creating a new instance of the InMemoryCache. */
const cache: InMemoryCache = new InMemoryCache();

/* Creating a new instance of the CachePersistor. */
export const persistor: CachePersistor<NormalizedCacheObject> = new CachePersistor({
  cache,
  // @ts-ignore
  storage: new MMKVWrapper(storage),
  debug: AppConst.isDevelopment,
  key: 'SampleChatApplicationGraphqlCachePersist'
});

export let client: ApolloClient<NormalizedCacheObject>;

let tokenData: any = null;
const authLink = setContext(async (_, { headers }) => {
  tokenData = await getToken();

  const token = JSON.parse(tokenData)?.jwt ?? null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

/**
 * Log any GraphQL errors or network error that occurred
 */
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      // eslint-disable-next-line no-restricted-syntax
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  if (networkError) {
    // eslint-disable-next-line no-restricted-syntax
    console.log(`[Network error]: ${networkError}`);
  }
});

/**
 * It creates an Apollo Client instance and assigns it to the client variable
 */
export const initApolloClient = (): void => {
  const httpLink: ApolloLink = createHttpLink({ uri: AppConst.apiUrl });
  const wsLink = new WebSocketLink(
    new SubscriptionClient(AppConst.subscriptionUrl ?? '', {
      reconnect: true
    })
  );
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    httpLink
  );
  const link = ApolloLink.from([errorLink, authLink.concat(splitLink)]);
  client = new ApolloClient({
    link: link,
    cache: cache,
    connectToDevTools: AppConst.isDevelopment,
    name: 'SampleChatApplicationGraphqlClient',
    version: '1.0',
    queryDeduplication: false,
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache'
      },
      mutate: {
        fetchPolicy: 'no-cache'
      }
    }
  });
};

/**
 * It clears the cache of the apollo cache store
 * @returns {void}.
 */
export const clearCache = (): void => {
  if (!persistor) {
    return;
  }
  persistor.purge();
};
