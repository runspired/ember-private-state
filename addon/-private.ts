export type Dict<K extends string, V> = { [KK in K]: V | undefined };

export function dictionaryFor<T extends object>(map: WeakMap<T, Dict<string, any>>, instance: T) {
    let properties: Dict<string, any> | undefined = map.get(instance);
  
    if (properties === undefined) {
        properties = Object.create(null) as Dict<string, any>;
        map.set(instance, properties);
    }
  
    return properties;
  }