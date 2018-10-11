import 'reflect-metadata';

const jsonMetadataKey = "jsonProperty";
const valueConvert = "valueConvert";

export interface IJsonMetaData<T> {
  name?: string,
  clazz?: { new (): T }
}

export function JsonProperty<T> (metadata?: IJsonMetaData<T> | string): any {
  if (metadata instanceof String || typeof metadata === "string") {
    return Reflect.metadata(jsonMetadataKey, {
      name: metadata,
      clazz: undefined
    });

  } else {
    let metadataObj = <IJsonMetaData<T>>metadata;

    return Reflect.metadata(jsonMetadataKey, {
      name: metadataObj ? metadataObj.name : undefined,
      clazz: metadataObj ? metadataObj.clazz : undefined
    });
  }
}

export default class MapUtils {
  static isPrimitive (obj) {
    switch (typeof obj) {
      case "string":
      case "number":
      case "boolean":
        return true;
    }

    return !!(obj instanceof String || obj === String || obj === undefined ||
      obj instanceof Number || obj === Number ||
      obj instanceof Boolean || obj === Boolean);
  }


  static getJsonProperty<T> (target: any, propertyKey: string): IJsonMetaData<T> {
    return Reflect.getMetadata(jsonMetadataKey, target, propertyKey);
  }

  static getClazz (target: any, propertyKey: string): any {
    return Reflect.getMetadata("design:type", target, propertyKey);
  }

  static isArray (object) {
    if (object === Array) {
      return true;

    } else if (typeof Array.isArray === "function") {
      return Array.isArray(object);
    }

    else {
      return !!(object instanceof Array);
    }
  }

  static deserialize<T> (clazz: { new (): T }, json): T {
    let instance = new clazz();
    for (let prop in json) {
      if (!json.hasOwnProperty(prop)) {
        continue;
      }
      let curJProp = json[prop];
      if (curJProp == null) {
        continue;
      }
      if (this.isPrimitive(curJProp)) {
        let newValue = curJProp;
        instance[prop] = newValue;
      } else {
        if (this.isArray(curJProp)) {
          instance[prop] = [];
          if (curJProp.length > 0) {
            if (this.isPrimitive(curJProp[0])) {
              instance[prop] = curJProp;
            } else {
              let metadata = this.getJsonProperty(instance, prop);

              // if (!metadata)
              //   console.error("Reflect metadata error:", prop, curJProp);

              for (let i = 0; i < curJProp.length; i++) {
                try {
                  let nestedObj = this.deserialize(metadata.clazz!, json[prop][i]);
                  instance[prop].push(nestedObj);
                } catch (e) {
                  //   console.log('MapUtils.deserialize error:',
                  //     'curJPorop:', curJProp,
                  //     'prop:', prop,
                  //     'metadata:', metadata,
                  //     'error:', e);
                }
              }
            }
          }
        } else {
          let metadata = this.getJsonProperty(instance, prop);

          // if (!metadata)
          //   console.error("Reflect metadata error:", prop);

          try {
            instance[prop] = this.deserialize(metadata.clazz!, json[prop]);
          } catch (e) {
            // console.log('MapUtils.deserialize error:',
            //   'curJProp:', curJProp,
            //   'prop:', prop,
            //   'metadata:', metadata,
            //   'error:', e);
          }
        }
      }
    }
    return instance;
  }

  static deserializeCollection<T> (clazz: { new (): T }, json): Array<T> {
    let collection = new Array<T>();

    for (let i = 0; i < json.length; i++) {
      collection.push(this.deserialize(clazz, json[i]));
    }

    return collection;
  }
}
