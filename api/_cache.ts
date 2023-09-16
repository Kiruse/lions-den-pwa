
interface CacheEntry {
  data: any;
  expires: number;
}

export default class Cache {
  private _data: Record<PropertyKey, CacheEntry | Cache> = {};
  private _interval: NodeJS.Timeout | undefined;

  constructor(interval = 30000) {
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

  async get(key: string, getter: () => Promise<any>): Promise<any> {
    const proppath = key.split('.');
    const prop = proppath.pop()!;
    const cnt = this._container(proppath);

    if (!cnt._data[prop]) {
      cnt._data[prop] = {
        data: await getter(),
        expires: Date.now() + 3600000,
      };
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
      if (!target._data[prop]) {
        target._data[prop] = new Cache(-1);
      }

      const next = target._data[prop];
      if (!(next instanceof Cache)) {
        throw new Error(`Expected ${path.slice(0, i+1).join('.')} to be a Cache`);
      }
      target = next as Cache;
    });
    return target;
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
