import { MMKVKeys } from '../constants';
import { getStorageString } from '../services';

/**
 * A functional component that return token function
 */
const getToken = async () => {
  const tokenRaw: any = getStorageString(MMKVKeys.loginDetail, '{}');

  if (tokenRaw) {
    return tokenRaw;
  }
  return null;
};

export { getToken };
