import {
  useLazyQuery,
  type DocumentNode,
  type LazyQueryHookOptions,
  type LazyQueryResultTuple,
  type OperationVariables,
  type TypedDocumentNode
} from '@apollo/client';
import React, { useCallback, useRef } from 'react';

type LazyQueryWithCancelTokenHookReturnType<TData, TVariables extends OperationVariables> = [
  ...LazyQueryResultTuple<TData, TVariables>,
  () => void
];

/**
 * It's a wrapper around the `useLazyQuery` hook that adds an `abort` function to the returned object
 * @param {DocumentNode | TypedDocumentNode<TData, TVariables>} query - DocumentNode |
 * TypedDocumentNode<TData, TVariables>
 * @param [options] - LazyQueryHookOptions<TData, TVariables>
 * @returns An array with the following properties:
 *   - data: TData | undefined -> return a query data
 *   - error: ApolloError | undefined -> return a error when the query fails
 *   - loading: boolean -> flag to identify process is ongoing or not
 *   - networkStatus: NetworkStatus -> network status of process
 *   - called: boolean
 *   - client: ApolloClient<NormalizedCacheObject>
 *   - refetch: (variables?: TVariables | undefined) => Promise<ApolloQuery
 *   - abort: () => void -> to cancel the request
 */
function useLazyQueryWithCancelToken<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: LazyQueryHookOptions<TData, TVariables>
): LazyQueryWithCancelTokenHookReturnType<TData, TVariables> {
  const aborterRef: React.MutableRefObject<AbortController> = useRef<AbortController>(
    new AbortController()
  );
  const returnData: LazyQueryResultTuple<TData, TVariables> = useLazyQuery<TData, TVariables>(
    query,
    Object.assign({}, options, {
      context: {
        fetchOptions: {
          signal: aborterRef.current.signal
        }
      }
    })
  );

  const abort: () => void = useCallback<() => void>(() => {
    aborterRef.current.abort();
    aborterRef.current = new AbortController();
  }, []);

  return [...returnData, abort];
}

export default useLazyQueryWithCancelToken;
