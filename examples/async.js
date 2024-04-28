#!/usr/bin/env node

import test from 'node:test';
import { strict as assert } from 'node:assert';

// Promises are a proxy for an asynchronous value.
//
// Possible states:
// 1. Pending     (neither)
// 2. Fulfilled   (completed)
// 3. Rejected    (failed)

test('this promise is always pending', async () => {
  new Promise(() => { }).finally(() => {
    assert.fail('This should not be called');
  });

  // Wait for the event loop to be empty.
  await new Promise(process.nextTick);
});

// A promise can be resolved only once, but one of two ways:
//
// 1. Calling the `resolve` function in the constructor:
//    "new Promise(resolve => resolve(value))"
// 2. Calling the `resolve` static method on the Promise object:
//    "Promise.resolve(value)"
//
// The latter is typically used to wrap a synchronous value in a promise.

test('this promise is always resolved', async () => {
  let resolved = false;
  Promise.resolve().then(() => {
    resolved = true;
  });

  // Wait for the event loop to be empty.
  await new Promise(process.nextTick);

  assert.ok(resolved);
});

// A promise can be rejected only once, but one of two ways:
//
// 1. Calling the `reject` function in the constructor:
//    "new Promise((resolve, reject) => reject(reason))"
// 2. Calling the `reject` static method on the Promise object:
//    "Promise.reject(reason)"
//
// The latter is typically used to wrap a synchronous error in a promise.

test('this promise is always rejected', async () => {
  let rejected = false;
  Promise.reject().catch(() => {
    rejected = true;
  });

  // Wait for the event loop to be empty.
  await new Promise(process.nextTick);

  assert.ok(rejected);
});

// Finally, sometimes it's easier to call resolve/reject outside of the promise
// constructor, for example adapting a callback-based API. In this case, you can
// use `withResolvers`.
test('get a handle to resolve/reject with withResolvers', async () => {
  const { resolve, promise } = Promise.withResolvers();
  resolve(1);
  assert.equal(await promise, 1);
});

// You can also create a promise that is resolved or rejected based on multiple
// promises. There are several ways to do this:
//
// 1. `Promise.all` waits for all promises to resolve.
// 2. `Promise.allSettled` waits for all promises to resolve or reject.
// 3. `Promise.any` waits for the first promise to resolve.
// 4. `Promise.race` waits for the first promise to resolve or reject.

test('wait for all promises to resolve', async () => {
  const promises = [
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
  ];

  const result = await Promise.all(promises);
  assert.deepEqual(result, [1, 2, 3]);
});

test('waiting for all promises to resolve fails if one fails', async () => {
  const promises = [
    Promise.resolve(1),
    Promise.reject(2),
    Promise.resolve(3),
  ];

  await Promise.all(promises).then(() => {
    assert.fail('This should not be called');
  }).catch(error => {
    assert.equal(error, 2);
  });
});

test('wait for all promises to resolve or reject', async () => {
  const promises = [
    Promise.resolve(1),
    Promise.reject(2),
    Promise.resolve(3),
  ];

  const result = await Promise.allSettled(promises);
  assert.deepEqual(result, [
    { status: 'fulfilled', value: 1 },
    { status: 'rejected', reason: 2 },
    { status: 'fulfilled', value: 3 },
  ]);
});

test('wait for the first promise to resolve', async () => {
  const promises = [
    new Promise(resolve => setTimeout(() => resolve(1), 10)),
    new Promise(resolve => setTimeout(() => resolve(2), 20)),
    new Promise(resolve => setTimeout(() => resolve(3), 30)),
  ];

  const result = await Promise.any(promises);
  assert.equal(result, 1);
});

test('wait for the first promise to resolve or reject', async () => {
  const promises = [
    new Promise((_, reject) => setTimeout(() => reject(1), 10)),
    new Promise((_, reject) => setTimeout(() => reject(2), 20)),
    new Promise((_, reject) => setTimeout(() => reject(3), 30)),
  ];

  const result = await Promise.race(promises).catch((e) => e);
  assert.equal(result, 1);
});

// Promises fundamentally cannot be "cancelled".
//
// Imagine we want to make two network requests, but we only care about the
// first one to complete. If the second request completes first, we don't want
// to wait for the first request to complete nor spend resources processing it.
//
// We would need to create a custom API using AbortController.

test('cancel after the first promise resolves', async () => {
  // We don't want to use a "real" fetch API, so we'll simulate it.
  const fetch = (_, options) => {
    const { promise, resolve, reject } = Promise.withResolvers();
    options?.signal?.addEventListener('abort', () => reject('aborted'));
    return { promise, resolve };
  };

  const controller = new AbortController();
  const { promise: first } = fetch('https://example.com/first', {
    signal: controller.signal,
  });
  const { promise: second, resolve } = fetch('https://example.com/second');

  // Cancel the first request.
  controller.abort();

  // Resolve the second request.
  resolve(1);

  // Wait for both requests to complete.
  const result = await Promise.allSettled([first, second]);
  assert.deepEqual(result, [
    { status: 'rejected', reason: 'aborted' },
    { status: 'fulfilled', value: 1 },
  ]);
});

// It's possible to create a stream of values using promises. This is useful for
// handling events or other asynchronous data sources, though there are other
// libraries that try to do it other ways.

test('create a stream of values', async () => {
  // async* functions are a way to create an async generator.
  async function* stream() {
    for (let i = 0; i < 3; i++) {
      yield await new Promise(resolve => resolve(i));
    }
  }

  const values = [];
  for await (const value of stream()) {
    values.push(value);
  }

  assert.deepEqual(values, [0, 1, 2]);
});
