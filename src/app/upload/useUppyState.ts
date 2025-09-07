import { Uppy, State, Meta } from "@uppy/core";
import { useMemo } from "react";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";
import { type AwsBody } from '@uppy/aws-s3'

export function useUppyState<T, TMeta>(uppy: Uppy<Meta, AwsBody>, selector: (state: State<TMeta>) => T) {
  const store = (uppy as any).store;

  const subscribe = useMemo(() => store.subscribe.bind(store), [store]);
  const getSnapshot = useMemo(() => store.getState.bind(store), [store]);

  return useSyncExternalStoreWithSelector(
    subscribe,
    getSnapshot,
    getSnapshot,
    selector,
  );
}