
export interface CacheEntry {
  data: any;
  expires: number;
}

/**
 * A rudimentary cache where entries are purged in batches at a fixed interval. Does not refresh
 * entries' expiration as it is intended to require a refresh from the source.
 */
export default class Cache {
  private _data: Record<PropertyKey, CacheEntry | Cache> = {};
  private _interval: NodeJS.Timeout | undefined;

  constructor(interval = 30000, public readonly ttl = 3600000) {
    if (interval > 0) {
      this._interval = setInterval(() => {
        this.purge();
      }, interval);
    }
  }

  close() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = undefined;
    }
    return this;
  }

  has(key: string) {
    if (key.includes('.')) {
      const proppath = key.split('.');
      const prop = proppath.pop()!;
      const cnt = this._container(proppath);
      return prop in cnt._data;
    } else {
      return key in this._data;
    }
  }

  protected _set(key: string, value: any) {
    const proppath = key.split('.');
    const prop = proppath.pop()!;
    const cnt = this._container(proppath);
    cnt._data[prop] = value;
  }

  protected _nest(key: string) {
    if (key in this._data) {
      throw Error(`Key ${key} already exists`);
    }
    this._data[key] = new Cache(-1);
  }

  async get(key: string, getter: () => Promise<any>): Promise<any> {
    const proppath = key.split('.');
    const prop = proppath.pop()!;
    const cnt = this._container(proppath);

    if (!cnt.has(prop)) {
      this._store(key, cnt, {
        data: await getter(),
        expires: Date.now() + this.ttl,
      });
    }

    const result = cnt._data[prop];
    if (result instanceof Cache) {
      throw new Error(`Expected ${key} to be a leaf`);
    }
    return result.data;
  }

  protected _container(path: string[]): Cache {
    let target: Cache = this;
    path.forEach((prop, i) => {
      if (!target.has(prop)) {
        target._nest(prop);
      }

      const next = target._data[prop];
      if (!(next instanceof Cache)) {
        throw new Error(`Expected ${path.slice(0, i+1).join('.')} to be a Cache`);
      }
      target = next as Cache;
    });
    return target;
  }

  /** Hook for when the cache is about to store an entry in itself or a subcache. */
  protected _store(key: string, cache: Cache, entry: CacheEntry) {
    cache._data[key.slice(key.lastIndexOf('.') + 1)] = entry;
  }

  /** Purge the cache of expired entries */
  purge() {
    for (const key in this._data) {
      const curr = this._data[key];
      if (curr instanceof Cache) {
        curr.purge();
      } else if (curr.expires < Date.now()) {
        delete this._data[key];
      }
    }
    return this;
  }
}
