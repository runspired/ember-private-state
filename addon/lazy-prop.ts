import { DEBUG } from "@glimmer/env";
import { dictionaryFor } from "./-private";

const MetaProperties = DEBUG ? new WeakMap() : null;

function metaFor(instance: object) {
  return dictionaryFor(MetaProperties as WeakMap<object, object>, instance);
}

export default function lazyProp(target: any, name: string, descriptor) {
  let key = `___${name}`;
  const get = descriptor.get;
  const set = descriptor.set;
  let setter;

  // put it on the proto so the shape doesn't change later
  if (!DEBUG) {
    target[key] = null;
  }

  function lazyGetter() {
    let value = DEBUG ? metaFor(this)[key] : this[key];
    if (value === undefined) {
      value = get.call(this);
      DEBUG ? (metaFor(this)[key] = value) : (this[key] = value);
    }
    return value;
  }

  if (set) {
    setter = function lazySetter(v) {
      let newValue = set.call(this, v);
      DEBUG ? (metaFor(this)[key] = newValue) : (this[key] = newValue);
    };
  }

  return {
    enumerable: true,
    configurable: false,
    get: lazyGetter,
    set: setter
  };
}
