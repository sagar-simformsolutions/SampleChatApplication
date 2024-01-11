import Config from 'react-native-config';
const appVersion = 'v1.0(1)';

/**
 * A constant freezing object that contains the app value.
 * @type {Object}
 */
export default Object.freeze({
  mobile: 'Mobile',
  isDevelopment: __DEV__ || (Config.ENVIRONMENT ?? 'dev') === 'dev',
  environment: Config.ENVIRONMENT ?? 'dev',
  sentryUrl: Config.SENTRY_URL ?? '',
  apiUrl: 'http://localhost:4000/',
  subscriptionUrl: 'ws://localhost:4000/graphql',
  appVersion
});
