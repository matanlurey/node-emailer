#!/usr/bin/env node

import { before, after, test, suite } from 'node:test';
import { strict as assert } from 'node:assert';
import { createServer } from 'node:http';
import { URL } from 'node:url';

suite('fetch', () => {
  // Start a basic HTTP server to test fetch.
  //
  // A GET request to the root path should return "Hello, World!".
  // A-non GET request should stall (never respond).
  // Any other request should return a 404.
  let server;
  let baseUrl;
  before(() => {
    server = createServer((req, res) => {
      if (req.url === '/') {
        if (req.method === 'GET') {
          res.end('Hello, World!');
        } else {
          // Intentionally stall the response.
        }
      } else {
        res.statusCode = 404;
        res.end('Not Found');
      }
    });

    server.listen();
    baseUrl = new URL(`http://localhost:${server.address().port}`);
  });

  after(() => {
    server.close();
  });

  test('fetch a URL successfully', async () => {
    const response = await fetch(new URL('/', baseUrl));
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'Hello, World!');
  });

  test('fetch a URL that does not exist', async () => {
    const response = await fetch(new URL('/not-found', baseUrl));
    assert.equal(response.status, 404);
    assert.equal(await response.text(), 'Not Found');
  });

  test('abort a fetch request', async () => {
    const controller = new AbortController();

    // Timeout the request after 10ms.
    setTimeout(() => controller.abort(), 10);

    try {
      await fetch(new URL('/', baseUrl), {
        signal: controller.signal,
        method: 'POST',
      });
      assert.fail('This should not be called');
    } catch (err) {
      assert.equal(err.name, 'AbortError');
    }
  });
});
