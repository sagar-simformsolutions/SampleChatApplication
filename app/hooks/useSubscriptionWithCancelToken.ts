import {
  useApolloClient,
  type DocumentNode,
  type OperationVariables,
  type SubscriptionHookOptions,
  type SubscriptionResult,
  type TypedDocumentNode
} from '@apollo/client';
import { DocumentType, verifyDocumentType } from '@apollo/client/react/parser';
import { type ObservableSubscription } from '@apollo/client/utilities';
import { invariant } from '@apollo/client/utilities/globals';

import { equal } from '@wry/equality';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type SubscriptionWithCancelTokenHookReturnType<TData> = SubscriptionResult<TData, any> & {
  abort: () => void;
};

/**
 * It's a wrapper around the `useSubscription` hook that adds an `abort` function to the returned object
 * @param {DocumentNode | TypedDocumentNode<TData, TVariables>} subscription - DocumentNode |
 * TypedDocumentNode<TData, TVariables>
 * @param [options] - SubscriptionHookOptions<TData, TVariables>
 * @returns An object with the following properties:
 *   - data: TData | undefined -> return a query data
 *   - error: ApolloError | undefined -> return a error when the query fails
 *   - loading: boolean -> flag to identify process is ongoing or not
 *   - abort: () => void -> to cancel the request
 */
export default function useSubscriptionWithCancelToken<
  TData = any,
  TVariables extends OperationVariables = OperationVariables
>(
  subscription: DocumentNode | TypedDocumentNode<TData, TVariables>,
  option?: SubscriptionHookOptions<TData, TVariables>
): SubscriptionWithCancelTokenHookReturnType<TData> {
  const hasIssuedDeprecationWarningRef = useRef<boolean>(false);
  const aborterRef: React.MutableRefObject<AbortController> = useRef<AbortController>(
    new AbortController()
  );
  const options = useMemo<SubscriptionHookOptions<TData, TVariables> | undefined>(() => {
    if (option) {
      return Object.assign({}, option, {
        context: {
          fetchOptions: {
            signal: aborterRef.current.signal
          }
        },
        fetchOptions: {
          signal: aborterRef.current.signal
        }
      });
    }
    return option;
  }, [option]);

  const client = useApolloClient(options?.client);
  verifyDocumentType(subscription, DocumentType.Subscription);
  const [result, setResult] = useState<SubscriptionResult<TData>>({
    loading: !options?.skip,
    error: undefined,
    data: undefined,
    variables: options?.variables
  });

  if (!hasIssuedDeprecationWarningRef.current) {
    hasIssuedDeprecationWarningRef.current = true;

    if (options?.onSubscriptionData) {
      invariant.warn(
        options.onData
          ? "'useSubscription' supports only the 'onSubscriptionData' or 'onData' option, but not both. Only the 'onData' option will be used."
          : "'onSubscriptionData' is deprecated and will be removed in a future major version. Please use the 'onData' option instead."
      );
    }

    if (options?.onSubscriptionComplete) {
      invariant.warn(
        options.onComplete
          ? "'useSubscription' supports only the 'onSubscriptionComplete' or 'onComplete' option, but not both. Only the 'onComplete' option will be used."
          : "'onSubscriptionComplete' is deprecated and will be removed in a future major version. Please use the 'onComplete' option instead."
      );
    }
  }

  const [observable, setObservable] = useState(() => {
    if (options?.skip) {
      return null;
    }
    return client.subscribe({
      query: subscription,
      variables: options?.variables,
      fetchPolicy: options?.fetchPolicy,
      context: options?.context
    });
  });

  const canResetObservableRef = useRef(false);

  useEffect(() => {
    return () => {
      canResetObservableRef.current = true;
    };
  }, []);

  const ref = useRef({ client, subscription, options });
  const subscriptions = useRef<ObservableSubscription>();

  useEffect(() => {
    let shouldResubscribe = options?.shouldResubscribe;
    if (typeof shouldResubscribe === 'function') {
      shouldResubscribe = !!shouldResubscribe(options!);
    }

    if (options?.skip) {
      if (!options?.skip !== !ref.current.options?.skip || canResetObservableRef.current) {
        setResult({
          loading: false,
          data: undefined,
          error: undefined,
          variables: options?.variables
        });
        setObservable(null);
        canResetObservableRef.current = false;
      }
    } else if (
      (shouldResubscribe !== false &&
        (client !== ref.current.client ||
          subscription !== ref.current.subscription ||
          options?.fetchPolicy !== ref.current.options?.fetchPolicy ||
          !options?.skip !== !ref.current.options?.skip ||
          !equal(options?.variables, ref.current.options?.variables))) ||
      canResetObservableRef.current
    ) {
      setResult({
        loading: true,
        data: undefined,
        error: undefined,
        variables: options?.variables
      });
      setObservable(
        client.subscribe({
          query: subscription,
          variables: options?.variables,
          fetchPolicy: options?.fetchPolicy,
          context: options?.context
        })
      );
      canResetObservableRef.current = false;
    }
    Object.assign(ref.current, { client, subscription, options });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, subscription, options, canResetObservableRef.current]);

  useEffect(() => {
    if (!observable) {
      return;
    }

    subscriptions.current = observable.subscribe({
      /**
       * throw result
       */
      next(fetchResult) {
        const results = {
          loading: false,
          // TODO: fetchResult.data can be null but SubscriptionResult.data
          // expects TData | undefined only
          data: fetchResult.data!,
          error: undefined,
          variables: options?.variables
        };
        setResult(results);

        if (ref.current.options?.onData) {
          ref.current.options.onData({
            client,
            data: results
          });
        } else if (ref.current.options?.onSubscriptionData) {
          ref.current.options.onSubscriptionData({
            client,
            subscriptionData: results
          });
        }
      },
      /**
       * throw error
       */
      error(error) {
        setResult({
          loading: false,
          data: undefined,
          error,
          variables: options?.variables
        });
        ref.current.options?.onError?.(error);
      },
      /**
       * call complete process
       */
      complete() {
        if (ref.current.options?.onComplete) {
          ref.current.options.onComplete();
        } else if (ref.current.options?.onSubscriptionComplete) {
          ref.current.options.onSubscriptionComplete();
        }
      }
    });

    return () => {
      aborterRef.current.abort();
      aborterRef.current = new AbortController();
      subscriptions.current?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observable]);

  const abort: () => void = useCallback<() => void>(() => {
    aborterRef.current.abort();
    aborterRef.current = new AbortController();
    subscriptions.current?.unsubscribe();
    setResult({
      loading: false,
      data: undefined,
      error: undefined,
      variables: options?.variables
    });
  }, [subscriptions, aborterRef, options?.variables]);

  return { ...result, abort };
}
