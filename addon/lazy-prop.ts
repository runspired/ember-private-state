import { DEBUG } from '@glimmer/env';
import { dictionaryFor } from './-private';

const MetaProperties = DEBUG ? new WeakMap() : null;

function metaFor(instance: object) {
    return dictionaryFor(MetaProperties as WeakMap<object, object>, instance);
}

interface Descriptor<T> extends TypedPropertyDescriptor<T> {
    get: () => any;
}

export default function lazyProp(target: any, name: string, descriptor: Descriptor<any>): TypedPropertyDescriptor<any> {
  let key = `___${name}`;
  const get = descriptor.get;
  const set = descriptor.set;
  let setter;

  DEBUG ? metaFor(target)[key] = null : target[key] = null;

  function lazyGetter() {
    let value = DEBUG ? metaFor(target)[key] : this[key];
    if (value === null) {
      value = get.call(this);
      DEBUG ? metaFor(target)[key] = value : this[key] =  value;
    }
    return value;
  }

  if (set) {
    setter = function lazySetter(v) {
      let newValue = set.call(this, v); 
      DEBUG ? metaFor(target)[key] = newValue : this[key] = newValue;
    }
  }

  return {
    enumerable: true,
    configurable: false,
    get: lazyGetter,
    set: setter,
  }
}
