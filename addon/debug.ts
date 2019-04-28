import { DEBUG } from "@glimmer/env";
import { dictionaryFor } from "./-private";

const PrivateProperties = DEBUG ? new WeakMap() : null;

function privatePropertiesFor(instance: object) {
  let proto = instance.constructor.prototype;
  return dictionaryFor(PrivateProperties as WeakMap<Object, object>, proto);
}

const Handler = {
  get(target, key) {
    if (privatePropertiesFor(target)[key] === true) {
      const type = typeof target[key] === "function" ? "method" : "property";
      throw new Error(
        `Illegal Access of private ${type} '${key}' on ${target}`
      );
    }
    return typeof target[key] === "function"
      ? target[key].bind(target)
      : target[key];
  },
  set(target, key, value) {
    if (privatePropertiesFor(target)[key] === true) {
      throw new Error(
        `Illegal Attempt to set private property '${key}' on ${target} to ${value}`
      );
    }
    return (target[key] = value);
  }
};

const Instantiator = {
  construct(Target, args) {
    let instance = new Target(...args);
    return new Proxy(instance, Handler);
  }
};

export function isPrivate(
  target: object,
  name: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor;
export function isPrivate(
  target: object,
  name: string,
  descriptor: MethodDecorator
): MethodDecorator;
export function isPrivate(target, name, descriptor) {
  if (DEBUG) {
    privatePropertiesFor(target)[name] = true;
  }
  return descriptor;
}

export function DebugProxy<K>(klass: K): K {
  return DEBUG ? new Proxy(klass, Instantiator) : klass;
}
