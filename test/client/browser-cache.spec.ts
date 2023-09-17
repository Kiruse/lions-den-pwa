import test from 'tape-catch';
import BrowserCache from '../../lib/browser-cache';

// mock local storage used in tests
const mockStorage: any = {}
global.localStorage = new Proxy(mockStorage, {
  get: (target, key) => target[key],
  set: (target, key, value) => { target[key] = value + ''; return value },
});

function purgeStorage() {
  for (const key in mockStorage) {
    delete mockStorage[key];
  }
}

// BrowserCache generally works at all
test('BrowserCache: basic', async (t) => {
  t.plan(1);
  purgeStorage();
  const cache = new BrowserCache('test', 9999999); // do not purge
  const value = await cache.get('foo', async () => 'bar');
  t.equal(value, 'bar', 'should return value from getter');
  cache.close();
});

// BrowserCache can restore state from localStorage
test('BrowserCache: restore', async (t) => {
  t.plan(1);
  purgeStorage();

  // should save browser cache to localStorage
  let cache = new BrowserCache('test', 9999999); // do not purge
  await cache.get('foo', async () => 'baz');
  cache.close();

  // should restore browser cache from localStorage
  cache = new BrowserCache('test', 9999999); // do not purge
  const value = await cache.get('foo', async () => 'ERROR');
  t.equal(value, 'baz', 'should return value from storage');
  cache.close();
});

// BrowserCache
test('BrowserCache: purge', async (t) => {
  t.plan(2);
  purgeStorage();
  mockStorage['test.foo'] = JSON.stringify({
    data: 'bar',
    expires: 0, // expires immediately, purged at next run
  });

  const cache = new BrowserCache('test', 50);

  // should store value in localStorage
  let value = await cache.get('foo', async () => 'baz')
  t.equal(value, 'bar', 'should return value from storage');

  // wait long enough to trigger purge
  await new Promise((resolve) => setTimeout(resolve, 100));

  // should not restore value from localStorage
  value = await cache.get('foo', async () => 'baz')
  t.equal(value, 'baz', 'should return value from getter');
  cache.close();
});
