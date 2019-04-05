import { DEBUG } from '@glimmer/env';
import { metaFor, Dict } from './-private';

const UNDEFINED = {};

export default function memoize(serializer) {
  return function _memoize(target: any, name: string, descriptor) {
    if (DEBUG) {
      if (descriptor.get !== undefined) {
        throw new Error(`Cannot memoize a property, only methods`)
      }
      if (typeof descriptor.value !== 'function') {
          throw new Error(`can only memoize methods`);
      }
      if (typeof serializer !== 'function') {
        throw new Error(`can memoize methods without a serialization mechanism`);
      }
    }

    const key = `___${name}`;
    const expensiveFn = descriptor.value;

    // we don't allow side-effects so we can share this cache
    // this makes using memoize for a key function used by
    // lots of class instances extra fast
    const cacheParent =  DEBUG ? metaFor(target) : target;
    let cache: Dict<string, any> | null = cacheParent[key] = null;

    function retrieve() {
      const serialized = serializer.apply(undefined, arguments);
      cache = cacheParent[key] = (cache === null ? Object.create(null) : cache) as Dict<string, any>;
      let value = cache[serialized];

      if (value === undefined) {
        // We do not allow side-effects on the instance, so we
        // prevent access
        value = expensiveFn.apply(undefined, arguments);
        if (value === undefined) {
            value = UNDEFINED;
            cache[serialized] = value;
        }
      }

      return value === UNDEFINED ? undefined : value;
    }

    return {
        enumerable: true,
        configurable: false,
        value: retrieve
    };
  }
}