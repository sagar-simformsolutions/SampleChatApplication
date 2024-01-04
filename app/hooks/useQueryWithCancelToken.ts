import {
  useQuery,
  type DocumentNode,
  type OperationVariables,
  type QueryHookOptions,
  type QueryResult,
  type TypedDocumentNode
} from '@apollo/client';
import React, { useCallback, useRef } from 'react';

type QueryWithCancelTokenHookReturnType<TData, TVariables extends OperationVariables> = QueryResult<
  TData,
  TVariables
> & {
  abort: () => void;
};

/**
 * It's a wrapper around the `useQuery` hook that adds an `abort` function to the returned object
 * @param {DocumentNode | TypedDocumentNode<TData, TVariables>} query - DocumentNode |
 * TypedDocumentNode<TData, TVariables>
 * @param [options] - QueryHookOptions<TData, TVariables>
 * @returns An object with the following properties:
 *   - data: TData | undefined -> return a query data
 *   - error: ApolloError | undefined -> return a error when the query fails
 *   - loading: boolean -> flag to identify process is ongoing or not
 *   - networkStatus: NetworkStatus -> network status of process
 *   - called: boolean
 *   - client: ApolloClient<NormalizedCacheObject>
 *   - refetch: (variables?: TVariables | undefined) => Promise<ApolloQuery
 *   - abort: () => void -> to cancel the request
 */
function useQueryWithCancelToken<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>
): QueryWithCancelTokenHookReturnType<TData, TVariables> {
  const aborterRef: React.MutableRefObject<AbortController> = useRef<AbortController>(
    new AbortController()
  );
  const returnData: QueryResult<TData, TVariables> = useQuery<TData, TVariables>(
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

  return { ...returnData, abort };
}

export default useQueryWithCancelToken;
