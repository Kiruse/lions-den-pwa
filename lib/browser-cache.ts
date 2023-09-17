import Cache, { CacheEntry } from '../api/_cache'

/** Cache specialized for browser environments, ie. with localStorage */
export default class BrowserCache extends Cache {
  constructor(public readonly rootkey: string, interval?: number) {
    if (!rootkey || typeof rootkey !== 'string') {
      throw Error("Missing root key")
    }
    super(interval)

    Object.entries(localStorage).forEach(([key, value]) => {
      if (key.startsWith(`${rootkey}.`)) {
        const proppath = key.split('.');
        const prop = proppath.pop();
        proppath.shift();
        const container = this._container(proppath);
        //@ts-ignore
        container._data[prop] = JSON.parse(value);
      }
    });
  }

  protected _store(key: string, cache: Cache, entry: CacheEntry): void {
    super._store(key, cache, entry);
    localStorage[`${this.rootkey}.${key}`] = JSON.stringify(entry);
  }
}
