import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  type NormalizedCacheObject
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { CachePersistor, MMKVWrapper } from 'apollo3-cache-persist';
import { AppConst } from '../constants';
import { storage } from '../services';

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

const authLink: ApolloLink = setContext(async (_, { headers }) => {
  // eslint-disable-next-line no-restricted-syntax
  console.log(`[Headers]: ${headers}`);
  // TODO: You can add authorization token like below
  // const state = reduxStore?.store?.getState();
  // const authToken = state?.auth?.loginData?.access_token;
  // const token = `Bearer ${authToken}`;
  // return {
  //   headers: {
  //     ...headers,
  //     authorization: token
  //   }
  // };
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
  const link = ApolloLink.from([errorLink, authLink.concat(httpLink)]);
  client = new ApolloClient({
    link: link,
    cache: cache,
    connectToDevTools: AppConst.isDevelopment,
    name: 'SampleChatApplicationGraphqlClient',
    version: '1.0',
    queryDeduplication: false
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
