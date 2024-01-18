import { ApolloProvider } from '@apollo/client';
import { isNil } from 'lodash';
import React, { useEffect, useState, type FC } from 'react';
import Toast from 'react-native-toast-message';
import { FullScreenLoader } from './components';
import { client, initApolloClient, persistor } from './configs';
import { AppContainer } from './navigation';

/**
 * The main App component.
 * We're using the Provider component from react-redux to wrap our AppContainer component, which is the
 * component that contains all of our routes
 * @returns The App component is being returned
 */
const App: FC = () => {
  const [loadingCache, setLoadingCache] = useState<boolean>(true);

  useEffect(() => {
    persistor.restore().then(() => {
      initApolloClient();
      setLoadingCache(false);
    });
  }, []);

  if (loadingCache || isNil(client)) {
    return <FullScreenLoader />;
  }
  return (
    <ApolloProvider client={client}>
      <AppContainer />
      <Toast />
    </ApolloProvider>
  );
};

export default App;
